# Phase 4: Maps, nearby driver search, and driver discovery

## Architecture

Phase 4 introduces customer discovery without turning AutoConnect India into a transport aggregator.

- `LocationsModule` lets authenticated drivers share or stop sharing their latest GPS location.
- `DiscoveryModule` exposes a public nearby-driver search endpoint for customers and visitors.
- Nearby search uses a bounding-box prefilter and Haversine distance sorting. This is simple and portable for Phase 4; production scale can later move to PostGIS geospatial indexes.
- The web app uses OpenStreetMap tiles through Leaflet and keeps map rendering isolated in `DriverDiscoveryMap` so the provider can be replaced later.
- Only available and approved drivers are returned from discovery queries.
- Customers receive profile/location discovery information and contact drivers directly. The platform still does not assign rides, dispatch drivers, calculate fares, or collect ride payments.

## API endpoints

### Driver location sharing

Requires a driver JWT:

```http
Authorization: Bearer <accessToken>
```

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/drivers/me/location` | Store a driver location point and optionally mark the driver available. |
| `DELETE` | `/drivers/me/location` | Mark the driver unavailable and stop discovery visibility. |

Example:

```bash
curl -X POST http://localhost:4000/drivers/me/location \
  -H 'Authorization: Bearer <accessToken>' \
  -H 'Content-Type: application/json' \
  -d '{"latitude":10.0261,"longitude":76.3125,"isAvailable":true}'
```

### Customer nearby search

Public endpoint:

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/discovery/drivers/nearby?latitude=10.026&longitude=76.308&radiusKm=5&limit=20` | Find nearby approved and available drivers sorted by distance. |

Example:

```bash
curl 'http://localhost:4000/discovery/drivers/nearby?latitude=10.026&longitude=76.308&radiusKm=5&limit=20'
```

## Frontend routes

| Route | Purpose |
| --- | --- |
| `/discover` | Customer discovery screen with OpenStreetMap/Leaflet map and nearby driver cards. |

The current page uses demo driver markers so the UI works before real data is seeded. In the next integration pass, replace the demo array with a fetch to `/discovery/drivers/nearby` using the browser geolocation API.

## Local implementation steps

1. Install dependencies and generate Prisma.

   ```bash
   npm install
   npm run prisma:generate
   ```

2. Run migrations.

   ```bash
   npm run prisma:migrate -- --name phase_4_locations_discovery
   ```

3. Start the stack.

   ```bash
   docker compose up --build
   ```

4. Register and authenticate a driver using the Phase 2 flow.
5. Ensure an admin or seed has set the driver `verificationStatus` to `APPROVED`, because discovery intentionally excludes unapproved drivers.
6. Share the driver location with `POST /drivers/me/location`.
7. Open `http://localhost:3000/discover` or call the public nearby endpoint.

## Scaling path

Phase 4 uses a database-portable query to avoid requiring PostGIS on day one. Before city-level rollout:

- Add PostGIS to PostgreSQL.
- Store driver location as a geography point.
- Add a geospatial index.
- Replace bounding-box/Haversine application filtering with `ST_DWithin` and `ST_Distance`.
- Add location freshness rules, such as hiding drivers whose last location is older than 10 minutes.
- Add customer-side throttling and bot protection around public discovery.

## Privacy and safety rules

- Location sharing is optional for drivers.
- `DELETE /drivers/me/location` marks drivers unavailable immediately.
- Do not expose sensitive documents through discovery responses in production; return public profile photo URLs only after storage privacy is finalized.
- Add coarse location or jitter controls if drivers request additional privacy.
- Never display pricing, fare calculation, assignment, dispatch, or ride-payment flows in discovery.

## Phase 5 handoff

Phase 5 should add reviews, chat, and notifications on top of discovered driver profiles while preserving direct customer-to-driver contact.
