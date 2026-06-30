# Phase 2: Authentication, roles, driver registration, and customer registration

## Architecture

Phase 2 introduces mobile OTP authentication and role-aware onboarding while preserving AutoConnect India's non-aggregator boundary.

- Customers and drivers authenticate with a mobile number and OTP.
- Development uses OTP `123456`; production should replace the placeholder delivery path with an SMS provider such as Firebase Authentication, Twilio trial, MSG91, or an India-compliant transactional SMS gateway.
- JWT access tokens are short-lived and refresh tokens are persisted so sessions can be revoked.
- Roles are `CUSTOMER`, `DRIVER`, and `ADMIN` in Prisma. Phase 2 exposes customer and driver onboarding; admin login is deferred to Phase 7.
- Driver registration creates a `User`, `Driver`, and `DriverProfile` record. Document upload, vehicle management, and verification are Phase 3 concerns.

## API endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/auth/otp/request` | Create an OTP challenge for `CUSTOMER` or `DRIVER`. |
| `POST` | `/auth/otp/verify` | Verify OTP and receive access/refresh tokens. |
| `POST` | `/auth/register/customer` | Create or update a customer profile. |
| `POST` | `/auth/register/driver` | Create or update driver onboarding profile. |
| `POST` | `/auth/refresh` | Rotate a refresh token and issue a new access token. |
| `POST` | `/auth/logout` | Revoke a refresh token. |

## Local implementation steps

1. Copy environment variables.

   ```bash
   cp .env.example .env
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. Generate Prisma client.

   ```bash
   npm run prisma:generate
   ```

4. Start the full stack.

   ```bash
   docker compose up --build
   ```

5. Run migrations after the database is available.

   ```bash
   npm run prisma:migrate -- --name phase_2_auth_roles
   ```

6. Request an OTP in development.

   ```bash
   curl -X POST http://localhost:4000/auth/otp/request \
     -H 'Content-Type: application/json' \
     -d '{"mobile":"+919876543210","role":"DRIVER"}'
   ```

7. Verify the OTP using development code `123456`.

   ```bash
   curl -X POST http://localhost:4000/auth/otp/verify \
     -H 'Content-Type: application/json' \
     -d '{"mobile":"+919876543210","code":"123456"}'
   ```

8. Register a driver profile.

   ```bash
   curl -X POST http://localhost:4000/auth/register/driver \
     -H 'Content-Type: application/json' \
     -d '{"mobile":"+919876543210","name":"Ravi Kumar","serviceArea":"Kochi","languages":["Malayalam","Hindi","English"],"bio":"Local auto-rickshaw driver available for direct customer calls."}'
   ```

## Free-resource deployment guide

> Free tiers change frequently. Confirm limits before production launch and upgrade before handling real driver subscription revenue or sensitive documents.

### Recommended zero/low-cost MVP topology

- Frontend PWA: Cloudflare Pages free plan.
- API: Render Free web service for MVP testing.
- PostgreSQL: Neon Free Postgres or Supabase Free Postgres.
- Redis: Render Key Value free tier when available, or Upstash free Redis as a substitute.
- Object storage: Supabase Storage free tier for early document/photo tests, then migrate to Cloudflare R2 or S3-compatible paid storage.
- DNS/CDN/WAF: Cloudflare Free.

### Cloudflare Pages frontend

1. Push this repository to GitHub.
2. In Cloudflare Pages, create a project connected to the repository.
3. Configure:
   - Root directory: `apps/web`
   - Build command: `npm install && npm run build`
   - Output directory: `.next`
   - Environment variable: `NEXT_PUBLIC_API_BASE_URL=https://YOUR_API_HOST`
4. For fully dynamic Next.js features on Cloudflare, add the Cloudflare Next.js adapter in a later deployment hardening phase. The current Phase 2 UI is simple and can also be deployed as a static marketing/onboarding surface.

### Render API

1. Create a Render Web Service from the GitHub repository.
2. Configure:
   - Runtime: Node
   - Root directory: repository root
   - Build command: `npm install && npm run prisma:generate && npm run build -w @autoconnect/api`
   - Start command: `npm run start -w @autoconnect/api`
3. Add environment variables from `.env.example` with production secrets.
4. Set `DATABASE_URL` to Neon or Supabase's pooled PostgreSQL connection string.
5. Set `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` to long random values.
6. Run migrations from a trusted machine or CI job:

   ```bash
   DATABASE_URL='postgresql://...' npm run prisma:migrate -- --name phase_2_auth_roles
   ```

### Neon or Supabase PostgreSQL

1. Create a free Postgres project.
2. Copy the pooled connection string.
3. Set it as `DATABASE_URL` in Render and local `.env` when running migrations.
4. Keep free-tier storage limits in mind; production driver documents should not be stored directly in Postgres.

### Security checklist before public launch

- Replace development OTP with a real SMS provider.
- Remove `devCode` from OTP responses in production; the code already hides it unless `NODE_ENV !== 'production'`.
- Use strong JWT secrets and rotate compromised refresh tokens.
- Add audit logs around auth, profile changes, and document verification.
- Add stricter CORS origins before production traffic.
- Add CAPTCHA or device attestation on OTP request if abuse starts.
- Add rate limits per mobile number and IP address.

## Phase 3 handoff

Phase 3 should build on this by adding vehicle management, secure document uploads, object storage integration, and admin-verification workflows.
