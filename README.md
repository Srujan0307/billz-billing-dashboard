<div align="center"> <img src="billz-logo.png" alt="BILLZ Logo" width="300" />

</div>

                    BILLZ
         Next-Gen Subscription Billing Platform

Streamline your subscription billing only with BILLZ! Manage customers, create subscriptions, generate invoices, and track payments with powerful real-time analytics.

Getting Started

Sign Up/Log In: Use the auth pages to create an account and access the dashboard.

Dashboard: View real-time billing metrics, revenue trends, and subscription analytics with dynamic charts.

Customer Management: Add customers, create subscriptions, and generate professional invoices seamlessly.

Payment Tracking: Record payments across multiple methods and monitor overdue accounts with automated notifications.

BILLZ makes it simple to handle recurring billing, track revenue growth, and scale your SaaS business with comprehensive financial insights.

Features

Customer Management: Complete customer profiles with subscription history and revenue tracking.

Subscription Management: Flexible billing cycles, trial periods, plan upgrades, and automated renewals.

Invoice Generation: Professional invoice creation with tax calculations and PDF export.

Payment Processing: Multi-method payment recording with automated status updates.

Real-time Analytics: Dynamic charts for revenue trends, subscription breakdowns, and overdue tracking.

Supabase Integration: Full persistence, secure authentication, and real-time updates.

Usage

Open BILLZ in your browser.

Add customers and set up subscription plans.

Generate invoices automatically or manually.

Record payments and track transaction history.

Monitor business growth with real-time analytics.

Installation

Prerequisites

Node.js 18+

npm or yarn

Supabase account

Local Setup

# Clone the repository
git clone https://github.com/yourusername/billz.git
cd billz

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local


Add your Supabase credentials to .env.local:

NODE_ENV=development
PORT=3000

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret


Then run:

npm run dev


Visit http://localhost:3000 🎉

Deployment (Vercel)

Set these env vars in Vercel Project Settings:

NODE_ENV=production

SUPABASE_URL=your_supabase_url

SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

JWT_SECRET=your_jwt_secret

Auth/Protected routes and the dashboard are configured with real-time Supabase connections and dynamic content rendering.

Tech Stack

Node.js, Express.js

Supabase (DB & Auth)

Chart.js (analytics visualization)

Vanilla JavaScript, HTML5, CSS3

Vercel (deployment)

API Endpoints

Authentication

POST /api/auth/login

POST /api/auth/register

Dashboard

GET /api/dashboard/stats

Customers

GET /api/customers

POST /api/customers

DELETE /api/customers/:id

Subscriptions

GET /api/subscriptions

POST /api/subscriptions

Invoices

GET /api/invoices

POST /api/invoices

Payments

GET /api/payments

POST /api/payments

Health Check

GET /api/health

Support

For support, email srujannjadhav@gmail.com or open an issue on GitHub.

Built with ❤️ by Srujan Jadhav
⭐ Star this repo if you found it helpful!