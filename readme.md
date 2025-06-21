# Multi-Level Referral & Earning System with Live Data Updates

A scalable backend system built using Node.js, Express, PostgreSQL, Prisma ORM, and Socket.IO that supports:

- Multi-level referral tracking (Level 1 and Level 2)
- Real-time profit distribution based on purchases
- Secure authentication with JWT tokens stored in HTTP-only cookies
- Real-time earnings update using WebSockets
- Adminer support for quick DB access

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
    - [Authentication](#authentication)
    - [Transaction](#transaction)
    - [WebSocket](#websocket)

- [Error Handling and Api Response](#error-handling-and-api-response)
- [Logging](#logging)
- [Contributing](#contributing)

---

## Features

### ✅ User System

- Register with optional referral code
- Login and logout
- View and update profile
- View referred users and referral stats

### ✅ Multi-level Referrals

- Users can refer up to 8 direct users
- Earnings:

    - Level 1: 5% of referred user's purchase (if > 1000 Rs)
    - Level 2: 1% of grandchild user's purchase (if > 1000 Rs)

### ✅ Transactions & Earnings

- Users can make purchases
- Real-time earnings update to parent and grandparent via WebSocket
- Earnings history and summary

### ✅ Web Interface (HTML demo)

- Lightweight Bootstrap-based frontend for API + WebSocket demo
- View real-time earnings feed

---

## Tech Stack

- **Backend**: Node.js, Express, Prisma
- **Database**: PostgreSQL (via Docker)
- **Real-time**: Socket.IO
- **Frontend**: Simple Bootstrap HTML page
- **Auth**: JWT in HTTP-only cookies
- **Logger**: Winston (info + error logs)
- **ORM**: Prisma with UUID IDs

---

## Setup & Installation

### 🔄 Option 1: Using Docker (Recommended)

#### 1. Clone the Repository

```bash
git clone https://github.com/AnmolGoyal01/referral-and-earning-system
cd referral-and-earning-system
```

#### 2. Setup Environment

Create `.env` file:

```env
PORT=4000
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgresql://username:password@localhost:5432/referral_db
CORS_ORIGIN=*
```

#### 3. Start everything with Docker Compose:

```bash
docker-compose up -d
```

#### 4. Health-Check

visit [http://localhost:4000/health](http://localhost:4000/health)
it should show `{"message":"OK"}`

#### 5. Visit

- [http://localhost:4000/demo.html](http://localhost:4000/demo.html) -> Demo UI with live demo
- [http://localhost:8080](http://localhost:8080) -> Adminer DB GUI

#### 6. To tear down:

```bash
docker compose down
```

### 🧩 Option 2: Native install

#### 1. Clone the Repository

```bash
git clone https://github.com/AnmolGoyal01/referral-and-earning-system
cd referral-and-earning-system
```

#### 2. Setup Environment

Create `.env` file:

```env
PORT=4000
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgresql://username:password@localhost:5432/referral_db
CORS_ORIGIN=*
```

#### 3. Start your PostgreSQL server:

start your PostgreSQL server and create `referral_db` db in it.

#### 4. Install dependencies & Prisma:

```bash
npm install
npx prisma db push
```

#### 5. Start the server:

```bash
npm run dev
```

#### 6. Health-Check

visit [http://localhost:4000/health](http://localhost:4000/health)
it should show `{"message":"OK"}`

#### 7. Visit

- [http://localhost:4000/demo.html](http://localhost:4000/demo.html) -> Demo UI with live demo

---

## project Structure

```
src/
|-- index.js
|-- app.js
|-- constants.js
|-- routes/
|   |-- auth.routes.js
|   |-- transaction.routes.js
|-- controllers/
|   |-- auth.controller.js
|   |-- transaction.controller.js
|-- services/
|   |-- authService.js
|   |-- earningsService.js
|   |-- purchaseService.js
|-- db/
|   |-- prismaClient.js
|   |-- user.db.js
|   |-- earning.db.js
|   |-- purchase.db.js
|-- utils/
|-- middlewares/

public/
|-- demo.html
```

---

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL`
`PORT`
`JWT_SECRET`
`CORS_ORIGIN`

---

## API Documentation

Will publish API documentation using **Postman** and serve it at:

```http
GET /api/v1/docs
```

### 🧪 API Endpoints

#### Authentication

- Register User: `POST api/v1/auth/register`
- Login User: `POST api/v1/auth/login`
- Get Current User: `GET api/v1/auth/profile`
- Logout User: `POST api/v1/user/logout`
- Update User's Name: `PATCH api/v1/auth/update-name`
- Update Password: `PATCH api/v1/auth/update-password`
- Get Parent: `GET api/v1/auth/parent`
- Get List of Referrals: `GET api/v1/auth/referrals`
- Get Referral Code: `GET api/v1/auth/referral-code`

#### Transaction

- Make a Purchase: `POST api/v1/transaction/purchase`
- Get List of Earnings: `GET api/v1/transaction/earnings`
- Get List of Purchases: `GET api/v1/transaction/purchases`
- Get Earning Summary: `GET api/v1/transaction/earnings/summary`

###  WebSocket
Clients can connect via WebSocket to receive live earning notifications.
```
ws://localhost:4000
```
- Socket Event: `new-earning`
- Payload:
```json
{
  "amount": "50.05",
  "level": 1,
  "fromUser": "Referred User Name",
  "purchaseAmount": "1001.00"
}
```

---

## Error Handling and Api Response

This application includes a robust error-handling system and custom response handling to ensure consistency and clarity in API responses.

- Error Handling: The `ApiError` utility class is used for creating custom errors with specific HTTP statuses and messages. Any API error that occurs will be thrown as an `ApiError` instance and caught by the error handler, which then sends a standardized JSON response with the error code and message.
- Custom API Response: All successful responses are wrapped in the `ApiResponse` class to maintain a consistent structure. Each response includes an HTTP status code, a data payload (if applicable), and a message, ensuring all client responses follow the same structure.

---

## Logging

This application employs a structured logging system to capture and manage log data effectively for easier debugging and monitoring.

- Logger Setup: The `Winston` logging library is used to create separate log streams for informational messages (`info.log`) and error messages (`error.log`). This separation allows for better organization and filtering of logs based on their severity.
- Log Format: Logs include timestamps, log levels, and descriptive messages. Different colors and formats are used for console output to distinguish between error logs and general info, making real-time debugging more user-friendly.
- Usage: Throughout the application, logs are generated to track API requests, responses, and unexpected errors, facilitating quick diagnosis and troubleshooting of issues.

---

## Contributing

Contributions are welcome! Please follow these steps:

##### 1. Fork the repository.

##### 2. Create a new branch (`git checkout -b feature/your-feature-name`)

##### 3. Commit your changes (`git commit -m 'Add some feature`)

##### 4. Push to the branch (`git push origin feature/your-feature-name`)

##### 5. Create a Pull Request.

---

## 🔗 Links

[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://anmolgoyal.me/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/anmol-goyal-358804235/)
[![twitter](https://img.shields.io/badge/github-010101?style=for-the-badge&logo=github&logoColor=white)](https://anmolgoyal.me/_next/static/media/github-icon.04fa7de0.svg)
