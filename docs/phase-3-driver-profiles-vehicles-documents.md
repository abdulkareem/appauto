# Phase 3: Driver profiles, vehicle management, and document uploads

## Architecture

Phase 3 extends the Phase 2 authentication foundation with protected driver self-service APIs.

- `DriversModule` owns driver dashboard summaries, profile updates, availability, and vehicle management.
- `DocumentsModule` owns driver document upload and listing.
- `StorageModule` abstracts file persistence. The current implementation stores files under `LOCAL_UPLOAD_DIR` for local development and can be replaced with Cloudflare R2, Supabase Storage, S3, or another S3-compatible object store without changing controller contracts.
- All Phase 3 routes require a valid JWT access token and the `DRIVER` role.
- Uploaded documents are stored as `DriverDocument` rows with verification status `PENDING`; admin review remains a Phase 7 workflow.

## API endpoints

All endpoints require:

```http
Authorization: Bearer <accessToken>
```

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/drivers/me/dashboard` | Driver dashboard with review, rating, vehicle, and document counts. |
| `GET` | `/drivers/me/profile` | Full driver profile, vehicles, documents, and reviews. |
| `PUT` | `/drivers/me/profile` | Update bio, languages, service area, working hours, and availability. |
| `GET` | `/drivers/me/vehicles` | List the driver's vehicles. |
| `POST` | `/drivers/me/vehicles` | Add a vehicle. |
| `DELETE` | `/drivers/me/vehicles/:vehicleId` | Delete a vehicle if it belongs to the authenticated driver. |
| `GET` | `/drivers/me/documents` | List uploaded documents. |
| `POST` | `/drivers/me/documents` | Upload one driver document using multipart form data. |

## Document upload rules

- Allowed file types: JPEG, PNG, WebP, and PDF.
- Maximum file size: 5 MB.
- Supported document types: `PROFILE_PHOTO`, `AUTO_PHOTO`, `LICENCE`, `REGISTRATION_CERTIFICATE`, `AADHAAR`, and `UPI_QR`.
- Aadhaar is optional and should not be required for basic onboarding.
- Every uploaded document starts with `PENDING` verification status.

## Local implementation steps

1. Start infrastructure.

   ```bash
   docker compose up postgres redis
   ```

2. Install dependencies and generate Prisma.

   ```bash
   npm install
   npm run prisma:generate
   ```

3. Run the Phase 3 migration.

   ```bash
   npm run prisma:migrate -- --name phase_3_driver_profiles_documents
   ```

4. Start the API and web app.

   ```bash
   npm run dev:api
   npm run dev:web
   ```

5. Authenticate as a driver using Phase 2 OTP.

   ```bash
   curl -X POST http://localhost:4000/auth/otp/request \
     -H 'Content-Type: application/json' \
     -d '{"mobile":"+919876543210","role":"DRIVER"}'

   curl -X POST http://localhost:4000/auth/otp/verify \
     -H 'Content-Type: application/json' \
     -d '{"mobile":"+919876543210","code":"123456"}'
   ```

6. Register or update the driver onboarding profile.

   ```bash
   curl -X POST http://localhost:4000/auth/register/driver \
     -H 'Content-Type: application/json' \
     -d '{"mobile":"+919876543210","name":"Ravi Kumar","serviceArea":"Kochi","languages":["Malayalam","Hindi","English"],"bio":"Local auto-rickshaw driver available for direct customer calls."}'
   ```

7. Update the authenticated driver profile.

   ```bash
   curl -X PUT http://localhost:4000/drivers/me/profile \
     -H 'Authorization: Bearer <accessToken>' \
     -H 'Content-Type: application/json' \
     -d '{"bio":"Available for direct customer calls around Kakkanad.","serviceArea":"Kakkanad, Kochi","languages":["Malayalam","English"],"isAvailable":true}'
   ```

8. Add a vehicle.

   ```bash
   curl -X POST http://localhost:4000/drivers/me/vehicles \
     -H 'Authorization: Bearer <accessToken>' \
     -H 'Content-Type: application/json' \
     -d '{"registrationNumber":"KL 07 AB 1234","make":"Bajaj","model":"RE"}'
   ```

9. Upload a document.

   ```bash
   curl -X POST http://localhost:4000/drivers/me/documents \
     -H 'Authorization: Bearer <accessToken>' \
     -F 'type=LICENCE' \
     -F 'file=@/path/to/licence.pdf'
   ```

## Free-resource storage guidance

For local development, uploaded files are written to `uploads/` and ignored by Git. For a free or low-cost MVP:

- Use Supabase Storage free tier for early profile-photo and document testing.
- Use Cloudflare R2 when you need S3-compatible storage with no egress fees, but verify current free allowance and pricing before production.
- Store only object keys and metadata in PostgreSQL; never store document binaries in the database.
- Use private buckets for licence, RC, Aadhaar, and UPI QR files.
- Generate short-lived signed URLs for admin review rather than making sensitive documents public.

## Security checklist

- Keep the 5 MB upload limit or lower it if abuse appears.
- Scan uploaded files before admin review in production.
- Enforce private object storage for sensitive documents.
- Redact Aadhaar numbers if OCR or manual review tooling is added.
- Add audit logs for uploads, deletes, verification decisions, and admin document views.
- Add per-driver upload quotas before public launch.

## Phase 4 handoff

Phase 4 should use verified driver profile, availability, service area, and latest shared location data to build map-based nearby driver discovery with OpenStreetMap and Leaflet.
