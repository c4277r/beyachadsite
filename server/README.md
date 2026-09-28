# Server

Express and Prisma API for the בית ביחד website. Prisma uses MongoDB.

## Local setup

1. Run `npm install`.
2. Copy `.env.example` to `.env` and configure `DATABASE_URL` and a unique `JWT_SECRET`.
3. Run `npm run prisma:generate` and `npm run prisma:push`.
4. Start the API with `npm run dev` (default: `http://localhost:4000`).

Set `CLIENT_URL` to the client origin. `ALLOWED_ORIGINS` can contain a comma-separated list; leave it empty to use `CLIENT_URL` plus the local Vite origin.

For production, copy `.env.production.example` to `.env.production` and set real values, or inject the same variables through the deployment platform. The server loads `.env.production` when `NODE_ENV=production`; platform-provided variables take precedence. Production startup requires a JWT secret of at least 64 characters and an explicit list of exact HTTPS origins. `.env.production` is ignored by Git; never commit it.

## Admin account

Set `ADMIN_NAME`, `ADMIN_EMAIL`, and a unique `ADMIN_PASSWORD` in the server `.env`, then run `npm run admin:create`. This creates one ADMIN account and refuses to overwrite an existing account. Replace the sample values before running it. There is no public registration endpoint.

## Scripts

- `npm run dev` - start the development server.
- `npm run build` - type-check and compile the server.
- `npm run start` - run the compiled server.
- `npm test` - run API and validation tests.
- `npm run prisma:generate` - generate the Prisma client.
- `npm run prisma:push` - apply the Prisma schema to MongoDB.
- `npm run admin:create` - create the initial admin from environment values.

Donation records are currently created as PENDING. Card processing and provider callbacks are not implemented; do not describe a pending record as a completed charge.
