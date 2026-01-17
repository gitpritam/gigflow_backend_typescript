# GigFlow Backend - Mini Freelance Marketplace Platform

A robust backend API for a freelance marketplace platform built with TypeScript, Express, MongoDB, and Socket.IO for real-time notifications.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Real-time Notifications](#real-time-notifications)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Contributing](#contributing)

## ✨ Features

### Authentication & Authorization

- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- Token-based authentication middleware
- Get authenticated user profile
- Cookie-based session management

### Gig Management

- Create new gigs (job postings)
- View all gigs with filtering
- Get individual gig details
- Change gig status (Open/Assigned/Completed/Cancelled)
- Owner-based authorization

### Bid Management

- Submit bids on gigs
- View all bids for a specific gig
- Hire freelancers (accept bids)
- Automatic rejection of other bids when one is accepted
- Transaction-based bid hiring for data consistency

### Real-time Notifications

- Socket.IO integration for instant notifications
- Real-time alerts when bids are accepted
- User-specific notification rooms
- Authenticated socket connections

### Additional Features

- Input validation with Zod
- Global error handling
- CORS configuration
- MongoDB transactions for atomic operations
- TypeScript for type safety
- ESLint and Prettier for code quality

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Zod
- **Real-time:** Socket.IO
- **Security:** bcryptjs, cookie-parser, CORS
- **Dev Tools:** ts-node-dev, ESLint, Prettier

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (v4.4 or higher)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/gitpritam/gigflow_backend_typescript.git
   cd gigflow_backend_typescript
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your actual values.

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Application
NODE_ENV=dev
PORT=5000

# Database
DATABASE_URL=mongodb://localhost:27017/gigflow

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=30d

# Bcrypt
BCRYPT_SALT_ROUNDS=12

#
```

> ⚠️ **Important:** Change the `JWT_SECRET` to a strong, random string in production!

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

Runs the server with hot reload and debugging on port 5000.

### Staging Mode

```bash
npm run stage
```

### Production Mode

```bash
npm run build
npm run prod
```

### Other Commands

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Check formatting
npm run format

# Fix formatting
npm run format:fix
```

## 📚 API Documentation

Base URL: `http://localhost:5000/api`

### Authentication Routes (`/api/auth`)

| Method | Endpoint    | Description            | Auth Required |
| ------ | ----------- | ---------------------- | ------------- |
| POST   | `/register` | Register new user      | No            |
| POST   | `/login`    | Login user             | No            |
| POST   | `/logout`   | Logout user            | Yes           |
| GET    | `/me`       | Get authenticated user | Yes           |

**Register Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Gig Routes (`/api/gigs`)

| Method | Endpoint         | Description       | Auth Required |
| ------ | ---------------- | ----------------- | ------------- |
| POST   | `/`              | Create a new gig  | Yes           |
| GET    | `/`              | Get all gigs      | Yes           |
| GET    | `/:gigId`        | Get gig details   | Yes           |
| PATCH  | `/:gigId/status` | Change gig status | Yes           |

**Create Gig Request Body:**

```json
{
  "title": "Build a REST API",
  "description": "Need a Node.js REST API",
  "budget": 500,
  "deadline": "2026-02-15"
}
```

### Bid Routes (`/api/bids`)

| Method | Endpoint       | Description                  | Auth Required |
| ------ | -------------- | ---------------------------- | ------------- |
| POST   | `/`            | Create a bid                 | Yes           |
| GET    | `/:gigId`      | Get all bids for a gig       | Yes           |
| PATCH  | `/:bidId/hire` | Hire freelancer (accept bid) | Yes           |

**Create Bid Request Body:**

```json
{
  "gigId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "price": 450,
  "message": "I can complete this in 5 days"
}
```

## 🔔 Real-time Notifications

The application uses Socket.IO for real-time notifications.

### Frontend Socket.IO Setup

```typescript
import { io } from "socket.io-client";

// Connect with authentication
const socket = io("http://localhost:5000", {
  auth: {
    token: "your-jwt-token-here",
  },
});

// Listen for notifications
socket.on("notification", (notification) => {
  console.log("New notification:", notification);
  // Handle notification (show toast, update UI, etc.)
});

// Handle connection events
socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
```

### Notification Events

**BID_ACCEPTED Event:**

```json
{
  "type": "BID_ACCEPTED",
  "message": "Congratulations! Your bid has been accepted for \"Build a REST API\"",
  "data": {
    "bidId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "gigId": "60f7a1a1a1a1a1a1a1a1a1a1",
    "gigTitle": "Build a REST API",
    "price": 450
  },
  "timestamp": "2026-01-13T10:30:00.000Z"
}
```

## 📁 Project Structure

```
gigflow_backend_typescript/
├── src/
│   ├── @types/              # TypeScript type definitions
│   │   ├── global/          # Global type declarations
│   │   └── interface/       # Interface definitions
│   ├── config/              # Configuration files
│   │   ├── cors.config.ts
│   │   ├── db.config.ts
│   │   ├── env.config.ts
│   │   └── socket.config.ts
│   ├── controllers/         # Request handlers
│   │   ├── auth/
│   │   ├── bid/
│   │   ├── gig/
│   │   └── user/
│   ├── middlewares/         # Express middlewares
│   │   ├── auth.middleware.ts
│   │   ├── globalErrorHandler.middleware.ts
│   │   └── validate.middleware.ts
│   ├── models/              # Mongoose models
│   │   ├── bids.model.ts
│   │   ├── gigs.model.ts
│   │   └── users.model.ts
│   ├── routes/              # Route definitions
│   │   ├── auth.router.ts
│   │   ├── bid.router.ts
│   │   ├── gig.router.ts
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   ├── asyncHandler.ts
│   │   ├── customError.ts
│   │   ├── jwt.ts
│   │   └── password.ts
│   ├── validations/         # Zod validation schemas
│   │   ├── auth/
│   │   ├── bid/
│   │   └── gig/
│   └── index.ts             # Application entry point
├── .env                     # Environment variables
├── .env.example             # Environment variables template
├── .gitignore
├── eslint.config.ts         # ESLint configuration
├── package.json
├── prettier.config.json     # Prettier configuration
├── tsconfig.json            # TypeScript configuration
└── README.md
```

## 📜 Scripts

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Start development server with hot reload |
| `npm run stage`      | Start staging server                     |
| `npm run build`      | Compile TypeScript to JavaScript         |
| `npm run prod`       | Run production server                    |
| `npm run start`      | Build and start production server        |
| `npm run lint`       | Run ESLint                               |
| `npm run lint:fix`   | Fix ESLint errors                        |
| `npm run format`     | Check code formatting                    |
| `npm run format:fix` | Fix code formatting                      |

## 🔒 Security Best Practices

- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- HTTP-only cookies for token storage
- CORS configured for specific origins
- Input validation on all endpoints
- MongoDB injection prevention through Mongoose
- Environment variables for sensitive data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**Pritam Majhi**

- GitHub: [@gitpritam](https://github.com/gitpritam)

## 🙏 Acknowledgments

- Express.js for the web framework
- MongoDB for the database
- Socket.IO for real-time capabilities
- The open-source community

---

**Happy Coding! 🚀**
