# Affiliate++ (MERN Link Management & Analytics Platform)

## Description

Affiliate++ is a full-stack web application for managing, shortening, and analyzing marketing links. It features robust authentication, role-based access control, payment integration, and detailed analytics, making it ideal for marketers, businesses, and teams who want to optimize their link campaigns.

## Features

- User registration, login, and Google OAuth
- Role-based access control (RBAC) for admin/user permissions
- Link management: create, edit, delete, and organize links
- Click analytics and dashboard
- Payment integration (credits & subscriptions)
- Password reset via email (6-digit code)
- Secure JWT authentication with refresh tokens
- User profile and session management
- Admin features: manage users, payments, and more
- Responsive UI with Bootstrap

## Tech Stack

- **Frontend:** React, Redux, React Router, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT, bcrypt, Google OAuth
- **Payments:** Razorpay 
- **Email:** Nodemailer (Gmail SMTP)

## Installation Instructions

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local or Atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/affiliate-plus-mern.git
cd affiliate-plus-mern
```

### 2. Install Dependencies

#### Frontend

```bash
cd mern-project-1
npm install
```

#### Backend

```bash
cd ../mern-project-server
npm install
```

### 3. Environment Variables

Create `.env` files in both `mern-project-1` and `mern-project-server` with the following (example):

#### mern-project-server/.env

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
GOOGLE_CLIENT_ID=your_google_client_id
GMAIL_EMAIL_ID=your_gmail_address
GMAIL_APP_PASSWORD=your_gmail_app_password
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

#### mern-project-1/.env

```
VITE_SERVER_ENDPOINT=http://localhost:5001
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 4. Start the Application

#### Backend

```bash
cd mern-project-server
npm run dev
```

#### Frontend

```bash
cd ../mern-project-1
npm run dev
```

## Usage Guide

- Visit `http://localhost:5173` in your browser.
- Register or log in (Google OAuth supported).
- Manage your links, view analytics, and purchase credits or subscriptions.
- Use the dashboard menu to manage users, payments, or reset your password.
- Forgot your password? Use the "Forgot Password?" link on the login page.

## API Endpoints (Backend)

### Auth

- `POST /auth/login` — User login
- `POST /auth/register` — User registration
- `POST /auth/google-auth` — Google OAuth login
- `POST /auth/logout` — Logout
- `POST /auth/is-user-logged-in` — Check session
- `POST /auth/send-reset-password-token` — Send 6-digit reset code
- `POST /auth/reset-password` — Reset password with code
- `POST /auth/refresh-token` — Refresh JWT access token

### Users

- `GET /users` — List users (admin)
- `POST /users` — Create user (admin)
- `PUT /users/:id` — Update user (admin)
- `DELETE /users/:id` — Delete user (admin)

### Links

- `GET /links` — List user links
- `POST /links` — Create link
- `PUT /links/:id` — Update link
- `DELETE /links/:id` — Delete link
- `GET /links/analytics` — Get analytics for a link

### Payments

- `POST /payments/create-order` — Create payment order
- `POST /payments/verify-order` — Verify payment
- `POST /payments/create-subscription` — Create subscription
- `POST /payments/verify-subscription` — Verify subscription

## Folder Structure

```
affiliate-link-manager/
├── mern-project-1/           # Frontend (React)
│   ├── src/
│   ├── public/
│   └── ...
├── mern-project-server/      # Backend (Node.js/Express)
│   ├── src/
│   ├── scripts/
│   └── ...
└── README.md
```

## Contribution Guidelines

1. Fork the repository and create your branch from `main`.
2. Commit your changes with clear messages.
3. Ensure code is linted and tested.
4. Submit a pull request describing your changes.

## License

This project is licensed under the MIT License.

## Author Info / Credits

- **Project Lead:** [Vikas Reddy](https://github.com/vikasreddy148)

- **Special Thanks:** Open source community, mentors, and testers.
