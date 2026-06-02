# Blood Bank Management System - Backend API

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Update `.env` file with your MongoDB connection string and JWT secret:
```
MONGODB_URI=mongodb://localhost:27017/bloodbank
JWT_SECRET=your_jwt_secret_key_change_this
PORT=5000
NODE_ENV=development
```

### 3. Start the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

---

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Signup
- **POST** `/api/auth/signup`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@gmail.com",
    "password": "password123",
    "blood": "A+"
  }
  ```
- **Response:** JWT token + user data

#### Login
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@gmail.com",
    "password": "password123"
  }
  ```
- **Response:** JWT token + user data
- **Note:** Email `admin@gmail.com` will get admin access

#### Get Profile
- **GET** `/api/auth/profile`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** Current user profile data

#### Update Profile
- **PUT** `/api/auth/profile`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "name": "Jane Doe",
    "blood": "A+",
    "phone": "9876543210",
    "address": "New Delhi",
    "password": "newpassword123"
  }
  ```
- **Response:** Updated user profile data

---

### Donor Routes (`/api/donors`)

#### Get All Donors
- **GET** `/api/donors`
- **Response:** List of all donors

#### Get Donor by ID
- **GET** `/api/donors/:id`
- **Response:** Single donor details

#### Add Donor (Admin Only)
- **POST** `/api/donors`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "name": "Rahul",
    "age": 24,
    "email": "rahul@gmail.com",
    "phone": "9876543210",
    "blood": "A+",
    "ailment": "None"
  }
  ```

#### Update Donor (Admin Only)
- **PUT** `/api/donors/:id`
- **Headers:** `Authorization: Bearer {token}`
- **Body:** Any fields to update

#### Delete Donor (Admin Only)
- **DELETE** `/api/donors/:id`
- **Headers:** `Authorization: Bearer {token}`

#### Get Donors by Blood Type
- **GET** `/api/donors/blood/:bloodType`
- **Example:** `/api/donors/blood/A+`

---

### Blood Request Routes (`/api/requests`)

#### Get All Requests
- **GET** `/api/requests`
- **Response:** All blood requests sorted by date

#### Get Request by ID
- **GET** `/api/requests/:id`

#### Create Request
- **POST** `/api/requests`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "name": "Arjun",
    "age": 30,
    "email": "arjun@gmail.com",
    "phone": "9876543210",
    "blood": "O+",
    "category": "Receiver",
    "ailment": "Diabetes",
    "unitsRequired": 2
  }
  ```

#### Update Request Status (Admin Only)
- **PUT** `/api/requests/:id`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "status": "Approved"
  }
  ```
- **Allowed statuses:** `Pending`, `Approved`, `Rejected`, `Completed`

#### Delete Request (Admin Only)
- **DELETE** `/api/requests/:id`
- **Headers:** `Authorization: Bearer {token}`

#### Get Requests by Status
- **GET** `/api/requests/status/:status`
- **Example:** `/api/requests/status/Pending`

---

## Blood Types Supported
- A+
- A-
- B+
- B-
- AB+
- AB-
- O+
- O-

---

## Authentication
All protected routes require JWT token in the header:
```
Authorization: Bearer {your_token_here}
```

Admin routes also require `isAdmin: true` in the token payload.

---

## Database Models

### User
- name, email, password (hashed), blood, isAdmin, createdAt

### Donor
- name, age, email, phone, blood, ailment, unitsAvailable, lastDonationDate, createdAt

### Request
- name, age, email, phone, blood, category, ailment, unitsRequired, status, createdAt

---

## Notes
- Passwords are hashed using bcryptjs before storage
- JWT tokens expire after 7 days
- Admin email: `admin@gmail.com`
- Requires MongoDB to be running locally or provide remote URI
