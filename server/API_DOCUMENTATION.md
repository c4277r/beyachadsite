# API Documentation - בית ביחד

## Base URL
```
http://localhost:4000/api
```

---

## 📋 Contact Messages API

### 1. Create Contact Message (Public)
**POST** `/contact`

Submit a contact form from the website.

**Request Body:**
```json
{
  "firstName": "דוד",
  "lastName": "כהן",
  "email": "david@example.com",
  "phone": "0501234567",
  "message": "אני רוצה להיות מתנדב בעמותה"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "הודעתך נשלחה בהצלחה! נחזור אליך בהקדם.",
  "data": {
    "id": "650f1a2b3c4d5e6f7g8h9i0j",
    "firstName": "דוד",
    "lastName": "כהן",
    "email": "david@example.com",
    "phone": "0501234567",
    "message": "אני רוצה להיות מתנדב בעמותה",
    "status": "UNREAD",
    "createdAt": "2026-09-18T10:30:00Z"
  }
}
```

---

### 2. Get All Contact Messages (Admin)
**GET** `/contact`

Retrieve all contact messages, optionally filtered by status.

**Query Parameters:**
- `status` (optional): `UNREAD`, `READ`, `HANDLED`, `ARCHIVED`

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "650f1a2b3c4d5e6f7g8h9i0j",
      "firstName": "דוד",
      "lastName": "כהן",
      "email": "david@example.com",
      "phone": "0501234567",
      "message": "אני רוצה להיות מתנדב בעמותה",
      "status": "UNREAD",
      "notes": null,
      "createdAt": "2026-09-18T10:30:00Z"
    }
  ]
}
```

---

### 3. Get Single Contact Message (Admin)
**GET** `/contact/:id`

Retrieve a specific contact message by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "650f1a2b3c4d5e6f7g8h9i0j",
    "firstName": "דוד",
    "lastName": "כהן",
    "email": "david@example.com",
    "phone": "0501234567",
    "message": "אני רוצה להיות מתנדב בעמותה",
    "status": "UNREAD",
    "notes": null,
    "createdAt": "2026-09-18T10:30:00Z",
    "updatedAt": "2026-09-18T10:30:00Z"
  }
}
```

---

### 4. Update Contact Message (Admin)
**PATCH** `/contact/:id`

Update the status or add internal notes to a contact message.

**Request Body:**
```json
{
  "status": "HANDLED",
  "notes": "התקשרנו ודיברנו על התנדבות"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "הודעה עודכנה בהצלחה",
  "data": {
    "id": "650f1a2b3c4d5e6f7g8h9i0j",
    "status": "HANDLED",
    "notes": "התקשרנו ודיברנו על התנדבות",
    "updatedAt": "2026-09-18T11:00:00Z"
  }
}
```

---

### 5. Delete Contact Message (Admin)
**DELETE** `/contact/:id`

Delete a contact message permanently.

**Response (200):**
```json
{
  "success": true,
  "message": "הודעה נמחקה בהצלחה"
}
```

---

## 💰 Donations API

### 1. Create Donation (Public)
**POST** `/donations`

Submit a donation from the donate page.

**Request Body:**
```json
{
  "amount": 180,
  "paymentType": "CREDIT_CARD",
  "donorName": "עמליה כהן",
  "donorEmail": "amalia@example.com",
  "donorPhone": "0505555555"
}
```

**Payment Types:** `CREDIT_CARD`, `BANK_TRANSFER`, `STANDING_ORDER`, `PHONE_PLEDGE`

**Response (201):**
```json
{
  "success": true,
  "message": "תרומתך קבלה בהצלחה! תודה על התמיכה.",
  "data": {
    "id": "660f1a2b3c4d5e6f7g8h9i0j",
    "amount": 180,
    "status": "PENDING",
    "createdAt": "2026-09-18T10:30:00Z"
  }
}
```

---

### 2. Get All Donations (Admin)
**GET** `/donations`

Retrieve all donations with optional filtering.

**Query Parameters:**
- `status` (optional): `PENDING`, `COMPLETED`, `FAILED`
- `paymentType` (optional): `CREDIT_CARD`, `BANK_TRANSFER`, `STANDING_ORDER`, `PHONE_PLEDGE`

**Response (200):**
```json
{
  "success": true,
  "count": 25,
  "totalAmount": 12500,
  "data": [
    {
      "id": "660f1a2b3c4d5e6f7g8h9i0j",
      "amount": 180,
      "paymentType": "CREDIT_CARD",
      "status": "PENDING",
      "donorName": "עמליה כהן",
      "donorEmail": "amalia@example.com",
      "createdAt": "2026-09-18T10:30:00Z"
    }
  ]
}
```

---

### 3. Get Single Donation (Public/Admin)
**GET** `/donations/:id`

Retrieve donation details and receipt information.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "660f1a2b3c4d5e6f7g8h9i0j",
    "amount": 180,
    "paymentType": "CREDIT_CARD",
    "status": "COMPLETED",
    "donorName": "עמליה כהן",
    "donorEmail": "amalia@example.com",
    "receiptUrl": "https://example.com/receipts/660f1a2b3c4d5e6f7g8h9i0j.pdf",
    "createdAt": "2026-09-18T10:30:00Z"
  }
}
```

---

### 4. Update Donation Status (Admin/Payment Processor)
**PATCH** `/donations/:id`

Update donation status after payment processing (called by payment processor webhook).

**Request Body:**
```json
{
  "status": "COMPLETED",
  "transactionId": "TRANS_123456789",
  "receiptUrl": "https://example.com/receipts/660f1a2b3c4d5e6f7g8h9i0j.pdf"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "תרומה עודכנה בהצלחה",
  "data": {
    "id": "660f1a2b3c4d5e6f7g8h9i0j",
    "status": "COMPLETED"
  }
}
```

---

### 5. Get Donation Statistics (Admin)
**GET** `/donations/stats/overview`

Get aggregate statistics and breakdown of all donations.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalDonations": 45,
    "completedDonations": 38,
    "pendingDonations": 7,
    "totalAmount": 45680,
    "averageDonation": 1202,
    "paymentTypeBreakdown": {
      "CREDIT_CARD": 32000,
      "BANK_TRANSFER": 10680,
      "STANDING_ORDER": 3000,
      "PHONE_PLEDGE": 0
    }
  }
}
```

---

## 📝 Content Management API (Testimonials & FAQ)

### Testimonials

#### 1. Get Testimonials (Public)
**GET** `/content/testimonials`

Get all active testimonials for homepage display.

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "670f1a2b3c4d5e6f7g8h9i0j",
      "author": "חיים, בן 16",
      "content": "מאז שהגעתי ל'בית ביחד', הרגשתי שפתאום יש לי מקום שבו באמת מבינים אותי...",
      "isActive": true,
      "orderIndex": 0,
      "createdAt": "2026-09-18T10:30:00Z"
    }
  ]
}
```

#### 2. Create Testimonial (Admin)
**POST** `/content/testimonials`

Add a new testimonial.

**Request Body:**
```json
{
  "author": "דניאל, בן 13",
  "content": "העמותה שינתה את חיי לטובה!"
}
```

#### 3. Update Testimonial (Admin)
**PATCH** `/content/testimonials/:id`

Update testimonial content or visibility.

**Request Body:**
```json
{
  "author": "דניאל, בן 13",
  "content": "העמותה שינתה את חיי לטובה!",
  "isActive": true,
  "orderIndex": 1
}
```

#### 4. Delete Testimonial (Admin)
**DELETE** `/content/testimonials/:id`

Remove a testimonial.

---

### FAQ

#### 1. Get FAQ Items (Public)
**GET** `/content/faq`

Get all active FAQ items for homepage display.

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "680f1a2b3c4d5e6f7g8h9i0j",
      "question": "למי מיועדות הפעילויות שלנו?",
      "answer": "הפעילויות שלנו מיועדות באהבה לילדים להורים גרושים...",
      "isActive": true,
      "orderIndex": 0,
      "createdAt": "2026-09-18T10:30:00Z"
    }
  ]
}
```

#### 2. Create FAQ (Admin)
**POST** `/content/faq`

Add a new FAQ item.

**Request Body:**
```json
{
  "question": "איך הופכים להתנדבים?",
  "answer": "ניתן ליצור איתנו קשר דרך טופס יצירת הקשר..."
}
```

#### 3. Get All FAQ Items (Admin)
**GET** `/content/faq/admin/all`

Get all FAQ items including inactive ones.

#### 4. Update FAQ (Admin)
**PATCH** `/content/faq/:id`

Update FAQ content.

**Request Body:**
```json
{
  "question": "איך הופכים להתנדבים?",
  "answer": "ניתן ליצור איתנו קשר דרך טופס יצירת הקשר...",
  "isActive": true,
  "orderIndex": 0
}
```

#### 5. Delete FAQ (Admin)
**DELETE** `/content/faq/:id`

Remove a FAQ item.

---

## Error Handling

All endpoints return error responses in the following format:

**Response (4xx/5xx):**
```json
{
  "success": false,
  "message": "נתונים לא תקינים",
  "details": {
    "fieldName": "error message"
  }
}
```

**Common Error Codes:**
- `400` - Bad Request (validation error)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Integration Guide

### Frontend Contact Form Integration (ContactForm.tsx)

```typescript
const onSubmit: SubmitHandler<IContactInput> = async (data) => {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.success) {
      alert(result.message);
      reset();
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Frontend Donation Integration (DonatePage.tsx)

```typescript
const onSubmitPayment: SubmitHandler<IDonateCreditCardInput> = async (data) => {
  try {
    const response = await fetch('/api/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: data.amount,
        paymentType: 'CREDIT_CARD',
        donorName: data.donorName,
        donorEmail: data.donorEmail,
        donorPhone: data.donorPhone,
      }),
    });
    const result = await response.json();
    if (result.success) {
      // Redirect to payment processor or show success
      alert(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Frontend Dynamic Content Loading (HomePage.tsx)

```typescript
useEffect(() => {
  const loadContent = async () => {
    const [testimonials, faqs] = await Promise.all([
      fetch('/api/content/testimonials').then(r => r.json()),
      fetch('/api/content/faq').then(r => r.json()),
    ]);
    setTestimonials(testimonials.data);
    setFaqs(faqs.data);
  };
  loadContent();
}, []);
```

---

## Environment Variables

```
PORT=4000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/bait-beyached
```

---

## Running the Server

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Generate Prisma Client
npm run prisma:generate

# Run Prisma migrations
npm run prisma:migrate
```
