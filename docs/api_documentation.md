# InvestEase Backend API Documentation

This reference guide documents the core REST endpoints exposed by the InvestEase Node.js/Express API. All routes (except Auth) require a valid JSON Web Token passed in the `x-auth-token` header.

---

## 🔐 1. Authentication Module

### Register Investor
*   **Method**: `POST`
*   **Path**: `/api/users/register`
*   **Request Body**:
    ```json
    {
      "name": "Darshan Parmar",
      "email": "darshan@investease.com",
      "password": "Password@123",
      "mobile": "9876543210"
    }
    ```
*   **Response**: `201 Created` returning the signed JWT Token.

### Login User
*   **Method**: `POST`
*   **Path**: `/api/users/login`
*   **Request Body**:
    ```json
    {
      "email": "darshan@investease.com",
      "password": "Password@123"
    }
    ```
*   **Response**: `200 OK` returning user profile details and signed JWT Token.

---

## 📊 2. Dashboard & Portfolio Module

### Get Dashboard Command Center Summary
*   **Method**: `GET`
*   **Path**: `/api/dashboard`
*   **Response**: `200 OK`
    ```json
    {
      "portfolioSnapshot": { "totalValue": 500000, "todayChange": 1500 },
      "kycStatus": "Approved",
      "healthScore": { "score": 96, "label": "Excellent" },
      "recentActivity": [...],
      "nextSip": {...},
      "insights": [...]
    }
    ```

### Get Detailed Portfolio Holdings
*   **Method**: `GET`
*   **Path**: `/api/portfolio`
*   **Response**: `200 OK` returning asset class allocations and specific mutual fund holdings.

---

## 💳 3. Auto SIP Module

### Create Auto SIP Mandate
*   **Method**: `POST`
*   **Path**: `/api/sip`
*   **Request Body**:
    ```json
    {
      "fundName": "SBI Equity Hybrid Fund",
      "amount": 5000,
      "frequency": "Monthly"
    }
    ```

### Pause or Cancel SIP
*   **Method**: `PUT`
*   **Path**: `/api/sip/:id`
*   **Request Body**:
    ```json
    {
      "status": "Paused"
    }
    ```

---

## 👤 4. Nominee Management Module

### Get Configured Nominees
*   **Method**: `GET`
*   **Path**: `/api/nominee`

### Add New Nominee
*   **Method**: `POST`
*   **Path**: `/api/nominee`
*   **Request Body**:
    ```json
    {
      "name": "Ramesh Parmar",
      "relationship": "Father",
      "allocationPercentage": 100,
      "panNumber": "ABCDE1234F"
    }
    ```

---

## 🛡️ 5. KYC Module

### Submit KYC Documents
*   **Method**: `POST`
*   **Path**: `/api/kyc`
*   **Content-Type**: `multipart/form-data`
*   **Request Files**: `pan` (file), `aadhaar` (file), `addressProof` (file)
*   **Response**: `201 Created` setting status to `Pending`.

---

## 🎫 6. Support & Guided Resolution Module

### Submit Guided Resolution Support Request
*   **Method**: `POST`
*   **Path**: `/api/support`
*   **Request Body**:
    ```json
    {
      "subject": "SIP payment mandate failure",
      "message": "My balance was maintained but the payment failed to clear."
    }
    ```

---

## ⚙️ 7. Admin Operations Module

### Fetch Pending KYC Reviews
*   **Method**: `GET`
*   **Path**: `/api/kyc/admin/pending`

### Approve/Reject KYC Request
*   **Method**: `PUT`
*   **Path**: `/api/kyc/admin/:id`
*   **Request Body**:
    ```json
    {
      "status": "Approved | Rejected",
      "remarks": "Documents verified successfully."
    }
    ```

### Fetch Support Ticket Queue
*   **Method**: `GET`
*   **Path**: `/api/support/admin/tickets`

### Resolve Ticket
*   **Method**: `PUT`
*   **Path**: `/api/support/admin/tickets/:id`
*   **Request Body**:
    ```json
    {
      "status": "Resolved",
      "adminResponse": "Mandate reset successfully. Please retry the auto-debit."
    }
    ```
