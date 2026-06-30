# Public launch guide: Cloudflare Pages + Railway

This guide walks through launching AutoConnect India publicly with:

- **Cloudflare Pages** for the static Next.js PWA in `apps/web`.
- **Railway** for the NestJS API in `apps/api`.
- **Railway PostgreSQL** for the Prisma database.
- **Railway Redis** for cache/rate-limit/session support when API features start using Redis.
- Optional **Cloudflare R2 or another object storage provider** for production document uploads.

The repository already contains the deployment-focused pieces this guide relies on:

- `wrangler.toml` sets the Cloudflare Pages asset directory to `apps/web/out`.
- `apps/web/next.config.mjs` exports the PWA as static files.
- `Dockerfile.api` builds the API service from the monorepo root.
- `.env.example` lists the required environment variables.

> Platform dashboards change over time. If a label differs slightly, use the matching setting with the same meaning.

## 1. Prerequisites

Create or confirm access to these accounts before starting:

1. GitHub account with access to this repository.
2. Cloudflare account.
3. Railway account.
4. A domain name, either managed in Cloudflare DNS or pointed to Cloudflare nameservers.
5. Node.js 22+ and npm 10+ on your local machine if you want to run verification commands before deployment.

## 2. Recommended production architecture

Use this split for the first public launch:

| Component | Platform | Purpose |
| --- | --- | --- |
| Web PWA | Cloudflare Pages | Serves the exported Next.js static app globally. |
| API | Railway | Runs the NestJS backend as a long-running Node service. |
| PostgreSQL | Railway | Stores users, drivers, documents, vehicles, locations, subscriptions, reviews, and app records. |
| Redis | Railway | Reserved for Redis-backed features such as throttling, cache, queues, or sessions. |
| Object storage | Cloudflare R2 or S3-compatible storage | Stores driver documents and images when replacing local uploads for production. |

Recommended public URLs:

- Web app: `https://yourdomain.com`
- API: `https://api.yourdomain.com`

## 3. Prepare production secrets

Generate strong production values before entering variables in Railway or Cloudflare.

```bash
openssl rand -base64 48
openssl rand -base64 48
```

Use one generated value for `JWT_ACCESS_SECRET` and the other for `JWT_REFRESH_SECRET`.

Never use the `change-me-*` values from `.env.example` in production.

## 4. Create the Railway project

1. Open Railway and create a new project.
2. Choose an empty project so you can add services one by one.
3. Add a **PostgreSQL** database service.
4. Add a **Redis** database service.
5. Add a new service for the API and connect it to this GitHub repository.

Keep all Railway services in the same Railway project so the API can use Railway service variables and private networking.

## 5. Configure Railway PostgreSQL

1. Open the PostgreSQL service in Railway.
2. Copy the provided `DATABASE_URL` connection string.
3. Prefer the internal/private connection string for the API service when Railway provides both public and private URLs.
4. Save the public connection string separately for one-time local migration commands if you need to run migrations from your laptop.

## 6. Configure Railway Redis

1. Open the Redis service in Railway.
2. Copy the provided Redis URL, normally named `REDIS_URL`.
3. Use the internal/private Redis URL in the API service when available.

## 7. Configure the Railway API service

In the Railway API service settings:

1. Set the repository to this repo.
2. Set the root directory to the repository root, not `apps/api`, because the Dockerfile copies root workspace files.
3. Set the builder to Dockerfile if Railway does not auto-detect it.
4. Set the Dockerfile path to:

```text
Dockerfile.api
```

5. Set the health check path after the first successful deploy:

```text
/health
```

6. Ensure Railway exposes the service on the `PORT` environment variable. The API reads `PORT` and falls back to `4000` locally.

## 8. Add Railway API environment variables

Add these variables to the Railway API service:

| Variable | Production value |
| --- | --- |
| `NODE_ENV` | `production` |
| `PORT` | Let Railway provide this automatically, or set `4000` only if Railway asks for a fixed port. |
| `DATABASE_URL` | Railway PostgreSQL internal/private URL. |
| `REDIS_URL` | Railway Redis internal/private URL. |
| `JWT_ACCESS_SECRET` | Strong generated secret. |
| `JWT_REFRESH_SECRET` | Strong generated secret. |
| `RAZORPAY_KEY_ID` | Razorpay production key, when payments are enabled. |
| `RAZORPAY_KEY_SECRET` | Razorpay production secret, when payments are enabled. |
| `FCM_PROJECT_ID` | Firebase Cloud Messaging project ID, when push notifications are enabled. |
| `OBJECT_STORAGE_ENDPOINT` | Production object storage endpoint, when document uploads are moved off local disk. |
| `OBJECT_STORAGE_BUCKET` | Production object storage bucket name. |
| `LOCAL_UPLOAD_DIR` | Use only as a temporary fallback. Do not rely on local disk for permanent production uploads. |

For the current API storage implementation, uploaded files are written to local disk. That is acceptable for local development, but not durable on most cloud app platforms. Before accepting real driver documents publicly, replace local upload storage with Cloudflare R2 or another durable object storage provider.

## 9. Initialize the production database

The current repository has a Prisma schema but no checked-in Prisma migrations. For a production launch, prefer creating and committing migrations before going live.

Recommended production-safe workflow:

1. On your local machine, create an initial migration against a local development database:

```bash
npm install
npm run prisma:generate
npx prisma migrate dev --schema apps/api/prisma/schema.prisma --name init
```

2. Commit the generated `apps/api/prisma/migrations/...` folder.
3. Deploy the API again on Railway.
4. Run the production migration command from Railway or a trusted machine with production `DATABASE_URL`:

```bash
npx prisma migrate deploy --schema apps/api/prisma/schema.prisma
```

Prototype-only shortcut if you have not created migrations yet:

```bash
npx prisma db push --schema apps/api/prisma/schema.prisma
```

Do not use `db push` as your normal long-term production migration process.

## 10. Deploy and verify the Railway API

1. Trigger a Railway deployment for the API service.
2. Wait for the build and deploy to complete.
3. Open the generated Railway public URL.
4. Verify the health endpoint:

```bash
curl https://your-railway-api-url/health
```

5. Add a custom domain in Railway for the API, for example:

```text
api.yourdomain.com
```

6. Follow Railway's DNS instructions. If your DNS is in Cloudflare, add the required `CNAME` or other record in Cloudflare DNS.
7. Verify the custom domain:

```bash
curl https://api.yourdomain.com/health
```

## 11. Create the Cloudflare Pages project

1. Open Cloudflare Dashboard.
2. Go to **Workers & Pages**.
3. Create a new **Pages** project.
4. Connect this GitHub repository.
5. Select the production branch you want to deploy.
6. Use these build settings:

| Setting | Value |
| --- | --- |
| Framework preset | Next.js, or None if you prefer manual settings. |
| Build command | `npm install && npm run build -w @autoconnect/web` |
| Build output directory | `apps/web/out` |
| Root directory | Repository root. |
| Node.js version | `22` or newer. |

`wrangler.toml` also declares `pages_build_output_dir = "apps/web/out"`, so Cloudflare Pages should validate and upload the static export instead of `.next` cache files.

## 12. Add Cloudflare Pages environment variables

Add these variables in the Cloudflare Pages project settings:

| Variable | Production value |
| --- | --- |
| `NODE_VERSION` | `22` |
| `NEXT_PUBLIC_API_BASE_URL` | `https://api.yourdomain.com` |
| `NEXT_PUBLIC_APP_NAME` | `AutoConnect India` |

Because these are `NEXT_PUBLIC_*` values, they are embedded into the static web build. If you change the API URL later, redeploy the Cloudflare Pages project.

## 13. Deploy and verify the Cloudflare Pages site

1. Trigger the first Cloudflare Pages deployment.
2. Confirm the build creates `apps/web/out`.
3. Confirm Cloudflare does not validate `.next/cache` as deployable assets.
4. Open the temporary Pages URL.
5. Test basic pages:

```text
/
/auth
/discover
/register/customer
/register/driver
/driver/dashboard
```

6. Add your production domain to the Pages project, for example:

```text
yourdomain.com
www.yourdomain.com
```

7. Follow Cloudflare's DNS prompts until the domain is active.

## 14. Smoke-test the public app

Run these checks after both API and web are live:

```bash
curl https://api.yourdomain.com/health
```

```bash
curl -I https://yourdomain.com
```

```bash
curl -I https://yourdomain.com/manifest.json
```

```bash
curl -I https://yourdomain.com/sw.js
```

Then test manually in a browser:

1. Load the home page.
2. Open the auth page.
3. Register or sign in with the OTP flow available in the current app.
4. Open driver profile, vehicles, documents, and dashboard pages.
5. Open the discovery page and confirm it can call the public API URL.
6. Install the PWA on a mobile device and confirm the icon and service worker load.

## 15. DNS and SSL checklist

Use Cloudflare DNS for the cleanest setup:

| Hostname | Target |
| --- | --- |
| `yourdomain.com` | Cloudflare Pages custom domain target. |
| `www.yourdomain.com` | Cloudflare Pages custom domain target. |
| `api.yourdomain.com` | Railway API custom domain target. |

Enable SSL/TLS in Cloudflare. Use HTTPS-only public URLs in app variables.

## 16. Operational checklist before public announcement

Before sharing the app publicly:

- Replace all placeholder secrets.
- Confirm API health is reachable over HTTPS.
- Confirm web pages are reachable over HTTPS.
- Confirm `NEXT_PUBLIC_API_BASE_URL` points to the production API domain.
- Confirm Prisma migrations are applied to production PostgreSQL.
- Confirm uploads are durable if you are accepting real driver documents.
- Confirm CORS works from the production web domain.
- Confirm rate limits and abuse protection are acceptable for public traffic.
- Confirm backups are enabled for PostgreSQL.
- Confirm Railway and Cloudflare billing limits/alerts are configured.
- Confirm privacy policy, terms, and support contact information are published before collecting real user data.

## 17. Troubleshooting

### Cloudflare says a file is larger than 25 MiB

Confirm Cloudflare Pages is deploying `apps/web/out`, not `.next`. The build output directory should be `apps/web/out`, and `wrangler.toml` should include:

```toml
pages_build_output_dir = "apps/web/out"
```

### The web app points to localhost

Set `NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com` in Cloudflare Pages and redeploy the web app.

### The API cannot connect to PostgreSQL

Check that `DATABASE_URL` exists in the Railway API service and points to the Railway PostgreSQL database. If using private networking, confirm the API and database are in the same Railway project/environment.

### Prisma types are missing during API build

Run Prisma generation before building the API:

```bash
npm run prisma:generate -w @autoconnect/api
```

`Dockerfile.api` already runs Prisma generation before `nest build`.

### Uploads disappear after redeploy

Local disk is not permanent app storage on most cloud platforms. Move production document uploads to Cloudflare R2 or another durable object storage service before collecting real user documents.

## 18. Suggested launch sequence

Follow this order to reduce surprises:

1. Create Railway PostgreSQL and Redis.
2. Configure and deploy the Railway API.
3. Apply Prisma migrations.
4. Verify `https://api.yourdomain.com/health`.
5. Configure Cloudflare Pages environment variables.
6. Deploy Cloudflare Pages from the production branch.
7. Attach `yourdomain.com` and `www.yourdomain.com`.
8. Smoke-test pages, API calls, PWA manifest, and service worker.
9. Enable monitoring, backups, and billing alerts.
10. Announce the public URL.

## 19. Useful platform documentation

- Cloudflare Pages Wrangler configuration: <https://developers.cloudflare.com/pages/functions/wrangler-configuration/>
- Railway monorepo deployments: <https://docs.railway.com/deployments/monorepo>
- Railway PostgreSQL: <https://docs.railway.com/databases/postgresql>
- Railway private networking: <https://docs.railway.com/networking/private-networking>
