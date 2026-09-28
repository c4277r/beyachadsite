# Client

Hebrew, right-to-left React site for בית ביחד, built with Vite.

## Local setup

1. Run `npm install`.
2. Copy `.env.example` to `.env.local` and set `VITE_API_URL` to the server API (default: `http://localhost:4000/api`).
3. Start the client with `npm run dev`.

## Scripts

- `npm run dev` - start the Vite development server.
- `npm run build` - type-check and build static production assets.
- `npm run preview` - preview the built client locally.
- `npm run lint` - run Oxlint.

The admin dashboard is available at `/#admin` and uses the server's admin login. Donation records can be submitted, but payment processing is not yet available; provider initiation and callback verification remain pending.
