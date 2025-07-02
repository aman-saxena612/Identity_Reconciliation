# 🧩 Identity Reconciliation API - Bitespeed Assignment

This is a backend service built with **Node.js**, **Express**, **PostgreSQL**, and **TypeORM** to reconcile customer identities across multiple sessions or purchases based on `email` and `phoneNumber`.

> ✅ Designed as part of Bitespeed's backend assignment for identity resolution.

---

## 🚀 Features

- Automatically detects duplicate customers using email/phone
- Maintains a **primary-secondary** contact relationship
- Handles edge cases like:
  - Merging two primary contacts
  - Linking indirect/chain-related contacts
  - Creating new entries when none match

---

## 🛠 Tech Stack

- **Node.js** with **TypeScript**
- **Express.js**
- **PostgreSQL** (via TypeORM)
- **TypeORM** for ORM and migrations

---

## 📦 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/identity-reconciliation.git
cd identity-reconciliation
```

## Configure Environment:
Create a .env file in the root:

PORT=8000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_pg_user
DB_PASSWORD=your_pg_password
DB_DATABASE=your_db_name

## Running the server:
```bash
npm run dev
```

## 🧪 API Usage
**POST /identify**

## 📥 Request Body:
```
{
  "email": "john@example.com",
  "phoneNumber": "1234567890"
}
```
## 📤 Response Format:
``` 
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["john@example.com", "johnny@example.com"],
    "phoneNumbers": ["1234567890", "0987654321"],
    "secondaryContactIds": [2, 3]
  }
}
```


