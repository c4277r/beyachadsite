# Server API

Base URL in local development: `http://localhost:4000/api`.

All successful API responses use `{ "success": true, "data": ... }`. Errors use `{ "success": false, "message": ..., "details": [...] }`.

## Authentication

### `POST /auth/login`

Public, rate-limited login. Body:

```json
{ "email": "admin@example.com", "password": "your-password" }
```

Returns a short-lived JWT and user details. Send the token to protected endpoints with `Authorization: Bearer <token>`.

There is no public registration endpoint. Create the first admin using the documented `npm run admin:create` command from the server folder.

## Contact messages

### `POST /contact`

Public and rate-limited. Body:

```json
{
  "firstName": "דוד",
  "lastName": "כהן",
  "email": "david@example.com",
  "phone": "0501234567",
  "message": "אני רוצה לשמוע פרטים נוספים על העמותה."
}
```

Valid submissions are saved as `UNREAD` and return HTTP 201.

### Protected staff endpoints

All require a valid JWT and ADMIN or EDITOR role:

- `GET /contact` - list messages; optional `?status=UNREAD|READ|HANDLED|ARCHIVED`.
- `GET /contact/:id` - retrieve one message.
- `PATCH /contact/:id` - set `status` and optionally internal `notes`.
- `DELETE /contact/:id` - permanently delete a message.

## Donations

### `POST /donations`

Public and rate-limited. Creates a `PENDING` record only; it does not charge a card or confirm a completed donation. Amount is in whole shekels and must be between ₪1 and ₪50,000. Card data is not accepted or stored.

```json
{
  "amount": 180,
  "paymentType": "CREDIT_CARD",
  "donorName": "עמליה כהן",
  "donorEmail": "amalia@example.com",
  "donorPhone": "0505555555"
}
```

`paymentType` may be `CREDIT_CARD`, `BANK_TRANSFER`, `STANDING_ORDER`, or `PHONE_PLEDGE`. Donor name and email are required; phone is optional and must match Israeli mobile format.

### Protected staff endpoints

- `GET /donations` - ADMIN or EDITOR; optionally filter by `?status=` and `?paymentType=`.
- `GET /donations/stats/overview` - ADMIN or EDITOR.
- `GET /donations/:id` - ADMIN or EDITOR.
- `PATCH /donations/:id` - ADMIN only; validates status, optional transaction ID and receipt URL.

The status update endpoint is an interim admin operation, not a payment webhook. Verify real payments with the provider before changing a donation to `COMPLETED`. Provider initiation and callback verification are not implemented yet.

## Health

`GET /health` is available outside the `/api` prefix and returns `{ "ok": true, "message": "Server is running" }`.

## Validation and errors

Invalid request bodies return HTTP 400 and field-level details. Unauthenticated requests return 401, insufficient roles return 403, missing records return 404, and unexpected server errors return 500. Public contact and donation submissions and admin login are rate-limited.

The API currently has no content-management endpoints. Testimonials and FAQ content are hardcoded in the client.
