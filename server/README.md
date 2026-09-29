# Server

Express and Prisma API for the בית ביחד website. Prisma uses MongoDB.

## Local setup

1. Run `npm install`.
2. Copy `.env.example` to `.env` and configure `DATABASE_URL` and a unique `JWT_SECRET`.
3. Run `npm run prisma:generate` and `npm run prisma:push`.
4. Start the API with `npm run dev` (default: `http://localhost:4000`).

Set `CLIENT_URL` to the client origin. `ALLOWED_ORIGINS` can contain a comma-separated list; leave it empty to use `CLIENT_URL` plus the local Vite origin.

For production, copy `.env.production.example` to `.env.production` and set real values, or inject the same variables through the deployment platform. The server loads `.env.production` when `NODE_ENV=production`; platform-provided variables take precedence. Production startup requires a JWT secret of at least 64 characters and an explicit list of exact HTTPS origins. `.env.production` is ignored by Git; never commit it.

## Email notifications

The API uses Resend's email API to notify `SITE_TEAM_EMAIL` (default: `beitbeyachad@gmail.com`) after a contact form submission and to email donors when their donation first changes from PENDING to COMPLETED. Configure `RESEND_API_KEY` and `EMAIL_FROM` in the server environment; the sender address/domain must be verified with Resend. Email failures are logged but do not undo saved submissions or donation status changes. Donation confirmation is triggered by the existing protected status-update endpoint; payment processing and automatic provider callbacks are not implemented. The confirmation email is not a tax receipt.

## Health checks and database backups

`GET /health` sends MongoDB a `ping` command and returns HTTP 503 if the database is unavailable.

The GitHub Actions workflow at `.github/workflows/mongodb-backup.yml` runs a MongoDB archive dump daily at 02:17 UTC and can also be started manually. Add a repository Actions secret named `MONGODB_URI` containing the production MongoDB connection URI before enabling it. Each compressed archive is uploaded as a workflow artifact for 90 days; restrict repository and Actions-artifact access because backups contain donor and contact data. Workflow artifacts are a bounded-retention backup, not a substitute for a long-term off-site backup policy.

To restore an archive with MongoDB Database Tools installed, download the workflow artifact and run `mongorestore --uri="$MONGODB_URI" --archive="<backup-file>" --gzip`. Test restores against a separate database before using them for recovery.

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
