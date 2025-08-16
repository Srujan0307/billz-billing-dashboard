===============================================================================
                                                                               
                   <div align="center">
  <img src="billz-logo.png" alt="BILLZ Logo" width="300" />
</div>

                                                                               
                               BILLZ
                  Next-Gen Subscription Billing Platform
                                                                               
   
                                                                               
===============================================================================

Streamline your subscription billing only with BILLZ! Manage customers, create subscriptions, generate invoices, and track payments with powerful real-time analytics.

=================
GETTING STARTED
=================

Sign Up/Log In: Use the auth pages to create an account and access the dashboard.

Dashboard: View real-time billing metrics, revenue trends, and subscription analytics with dynamic charts.

Customer Management: Add customers, create subscriptions, and generate professional invoices seamlessly.

Payment Tracking: Record payments across multiple methods and monitor overdue accounts with automated notifications.

BILLZ makes it simple to handle recurring billing, track revenue growth, and scale your SaaS business with comprehensive financial insights.

===========
FEATURES
===========
• Customer Management: Complete customer profiles with contact information, subscription history, and revenue tracking.

• Subscription Management: Flexible billing cycles, trial periods, plan upgrades, and automated renewals with real-time status updates.

• Invoice Generation: Professional invoice creation with automated numbering, tax calculations, and PDF export capabilities.

• Payment Processing: Multi-method payment recording with transaction references and automated invoice status updates.

• Real-time Analytics: Dynamic dashboard with revenue trends, subscription breakdowns, and overdue tracking with interactive charts.

• Supabase Integration: Full database persistence with real-time updates, secure authentication, and scalable infrastructure.

=========
USAGE
=========

1. Open BILLZ in your browser
2. Add customers and set up subscription plans with custom billing cycles
3. Generate invoices automatically or manually with professional templates
4. Record payments and track transaction history across multiple payment methods
5. Monitor business growth with real-time analytics and export comprehensive reports

===============
INSTALLATION
===============

Prerequisites:
- Node.js 18+
- npm or yarn
- Supabase account

Local Setup:

# Clone the repository
git clone https://github.com/yourusername/billz.git
cd billz

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Add your Supabase credentials to .env.local:
NODE_ENV=development
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret

# Execute database schema in Supabase SQL Editor
# (Schema provided below)

# Start the development server
npm run dev

# Open http://localhost:3000

Database Schema Setup:

Execute this SQL in your Supabase SQL Editor:

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    company VARCHAR(255),
    address_street VARCHAR(255),
    address_city VARCHAR(255),
    address_state VARCHAR(100),
    address_zip VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    total_revenue DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    plan_name VARCHAR(50) NOT NULL,
    plan_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    billing_cycle VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    next_billing_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices table
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'sent',
    due_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    invoice_id INTEGER REFERENCES invoices(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_date DATE NOT NULL,
    transaction_reference VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

=======================
DEPLOYMENT (VERCEL)
=======================

Set these env vars in Vercel Project Settings:

NODE_ENV
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
JWT_SECRET

Auth/Protected routes and the dashboard are configured with real-time database connections and dynamic content rendering.

============
TECH STACK
============

Node.js, Express.js
Supabase (database & auth)
Chart.js (analytics visualization)
Vanilla JavaScript, HTML5, CSS3
Vercel (deployment)

===============
API ENDPOINTS
===============

Authentication:
POST /api/auth/login
POST /api/auth/register

Dashboard:
GET /api/dashboard/stats

Customers:
GET /api/customers
POST /api/customers
DELETE /api/customers/:id

Subscriptions:
GET /api/subscriptions
POST /api/subscriptions

Invoices:
GET /api/invoices
POST /api/invoices

Payments:
GET /api/payments
POST /api/payments

Health Check:
GET /api/health


=========
SUPPORT
=========

For support, email srujanjadhav@gmai.com or open an issue on GitHub.

Built with ❤️ by Srujan Jadhav
⭐ Star this repo if you found it helpful!

===========================================================
