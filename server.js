const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware
app.use(cors());
app.use(express.json());

// Prevent caching for development
app.use((req, res, next) => {
  if (req.url.endsWith('.js') || req.url.endsWith('.css') || req.url.endsWith('.html')) {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// ===== AUTHENTICATION ROUTES =====
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, company, password } = req.body;
    console.log('🚀 REGISTER API CALLED:', { name, email, company });
    
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, email, and password are required' 
      });
    }

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        name: name,
        company: company || ''
      }
    });

    if (authError) {
      console.error('❌ Supabase auth error:', authError);
      return res.status(400).json({ success: false, error: authError.message });
    }

    console.log('✅ User registered with Supabase Auth:', authData.user);
    
    res.json({ 
      success: true, 
      message: 'User registered successfully',
      user: {
        id: authData.user.id,
        name: name,
        email: email,
        company: company || ''
      }
    });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ success: false, error: 'Registration failed: ' + error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🚀 LOGIN API CALLED:', email);
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (authError) {
      console.error('❌ Supabase login error:', authError);
      return res.status(401).json({ success: false, error: authError.message });
    }

    console.log('✅ User logged in with Supabase Auth:', authData.user.email);
    
    res.json({ 
      success: true, 
      token: authData.session.access_token,
      user: {
        id: authData.user.id,
        name: authData.user.user_metadata?.name || 'User',
        email: authData.user.email,
        company: authData.user.user_metadata?.company || ''
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed: ' + error.message });
  }
});

// ===== DASHBOARD STATS =====
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    console.log('🚀 GET DASHBOARD STATS API CALLED');
    
    // Get customer count
    const { count: customerCount, error: customerError } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });

    if (customerError) {
      console.error('❌ Error getting customer count:', customerError);
      return res.status(500).json({ success: false, error: customerError.message });
    }

    // Get active subscriptions count
    const { count: activeSubscriptions, error: subError } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Get trial subscriptions count  
    const { count: trialSubscriptions, error: trialError } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'trial');

    // Calculate monthly revenue from active subscriptions
    const { data: revenueData, error: revenueError } = await supabase
      .from('subscriptions')
      .select('plan_price')
      .eq('status', 'active');

    let monthlyRevenue = 0;
    if (revenueData) {
      monthlyRevenue = revenueData.reduce((total, sub) => total + (parseFloat(sub.plan_price) || 0), 0);
    }

    // Get overdue invoices count
    const { count: overdueInvoices, error: overdueError } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'overdue');

    // Get overdue amount
    const { data: overdueData, error: overdueAmountError } = await supabase
      .from('invoices')
      .select('total_amount')
      .eq('status', 'overdue');

    let overdueAmount = 0;
    if (overdueData) {
      overdueAmount = overdueData.reduce((total, inv) => total + (parseFloat(inv.total_amount) || 0), 0);
    }

    const stats = {
      totalCustomers: customerCount || 0,
      activeSubscriptions: (activeSubscriptions || 0) + (trialSubscriptions || 0),
      monthlyRevenue: monthlyRevenue,
      overdueInvoices: overdueInvoices || 0,
      overdueAmount: overdueAmount
    };

    console.log('✅ Dashboard stats calculated:', stats);
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('❌ Dashboard stats error:', error);
    res.status(500).json({ success: false, error: 'Failed to get dashboard stats: ' + error.message });
  }
});

// ===== CUSTOMER ROUTES =====
app.get('/api/customers', async (req, res) => {
  try {
    console.log('🚀 GET CUSTOMERS API CALLED');
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Get customers error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    console.log(`✅ Retrieved ${data.length} customers from Supabase`);
    res.json({ success: true, data: data });
  } catch (error) {
    console.error('❌ Get customers error:', error);
    res.status(500).json({ success: false, error: 'Failed to get customers: ' + error.message });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const { name, email, company, address_street, address_city, address_state, address_zip } = req.body;
    console.log('🚀 CREATE CUSTOMER API CALLED:', { name, email, company });
    
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }

    const customerData = {
      name: name,
      email: email,
      company: company || '',
      address_street: address_street || '',
      address_city: address_city || '',
      address_state: address_state || '',
      address_zip: address_zip || '',
      status: 'active',
      total_revenue: 0
    };
    
    const { data, error } = await supabase
      .from('customers')
      .insert([customerData])
      .select();

    if (error) {
      console.error('❌ Create customer error:', error);
      if (error.code === '23505') {
        return res.status(400).json({ success: false, error: 'Customer with this email already exists' });
      }
      return res.status(500).json({ success: false, error: error.message });
    }
    
    console.log('✅ Customer created in Supabase:', data[0]);
    res.json({ success: true, data: data });
  } catch (error) {
    console.error('❌ Create customer error:', error);
    res.status(500).json({ success: false, error: 'Failed to create customer: ' + error.message });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🚀 DELETE CUSTOMER API CALLED:', id);
    
    const { data, error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('❌ Delete customer error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    if (data.length === 0) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    
    console.log('✅ Customer deleted from Supabase:', data[0]);
    res.json({ success: true, data: data });
  } catch (error) {
    console.error('❌ Delete customer error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete customer: ' + error.message });
  }
});

// ===== SUBSCRIPTION ROUTES =====
app.get('/api/subscriptions', async (req, res) => {
  try {
    console.log('🚀 GET SUBSCRIPTIONS API CALLED');
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        customers (
          name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Get subscriptions error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    // Flatten the customer data
    const formattedData = data.map(sub => ({
      ...sub,
      customer_name: sub.customers?.name || 'Unknown',
      customer_email: sub.customers?.email || ''
    }));

    console.log(`✅ Retrieved ${data.length} subscriptions from Supabase`);
    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error('❌ Get subscriptions error:', error);
    res.status(500).json({ success: false, error: 'Failed to get subscriptions: ' + error.message });
  }
});

app.post('/api/subscriptions', async (req, res) => {
  try {
    const { customer_id, plan_name, plan_price, billing_cycle, status, start_date, trial_start, trial_end } = req.body;
    console.log('🚀 CREATE SUBSCRIPTION API CALLED:', { customer_id, plan_name, plan_price });
    
    if (!customer_id || !plan_name || !plan_price || !billing_cycle || !start_date) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    // Calculate next billing date
    const startDate = new Date(start_date);
    let nextBillingDate = new Date(startDate);
    
    switch(billing_cycle) {
      case 'monthly':
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 3);
        break;
      case 'yearly':
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
        break;
    }

    const subscriptionData = {
      customer_id: customer_id,
      plan_name: plan_name,
      plan_price: plan_price,
      billing_cycle: billing_cycle,
      status: status || 'active',
      start_date: start_date,
      next_billing_date: nextBillingDate.toISOString().split('T')[0],
      trial_start: trial_start,
      trial_end: trial_end
    };
    
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([subscriptionData])
      .select();

    if (error) {
      console.error('❌ Create subscription error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
    
    console.log('✅ Subscription created in Supabase:', data[0]);
    res.json({ success: true, data: data });
  } catch (error) {
    console.error('❌ Create subscription error:', error);
    res.status(500).json({ success: false, error: 'Failed to create subscription: ' + error.message });
  }
});

// ===== INVOICE ROUTES =====
app.get('/api/invoices', async (req, res) => {
  try {
    console.log('🚀 GET INVOICES API CALLED');
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        customers (
          name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Get invoices error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    // Flatten customer data
    const formattedData = data.map(inv => ({
      ...inv,
      customer_name: inv.customers?.name || 'Unknown',
      customer_email: inv.customers?.email || ''
    }));

    console.log(`✅ Retrieved ${data.length} invoices from Supabase`);
    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error('❌ Get invoices error:', error);
    res.status(500).json({ success: false, error: 'Failed to get invoices: ' + error.message });
  }
});

app.post('/api/invoices', async (req, res) => {
  try {
    const { customer_id, subscription_id, amount, description, due_date } = req.body;
    console.log('🚀 CREATE INVOICE API CALLED:', { customer_id, amount, due_date });
    
    if (!customer_id || !amount || !due_date) {
      return res.status(400).json({ success: false, error: 'Customer ID, amount, and due date are required' });
    }

    // Generate invoice number
    const { count } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true });
    
    const invoiceNumber = `INV-${String((count || 0) + 1001).padStart(4, '0')}`;

    // Calculate tax (10%)
    const taxAmount = parseFloat(amount) * 0.1;
    const totalAmount = parseFloat(amount) + taxAmount;

    const invoiceData = {
      invoice_number: invoiceNumber,
      customer_id: customer_id,
      subscription_id: subscription_id,
      amount: parseFloat(amount),
      tax_amount: taxAmount,
      total_amount: totalAmount,
      currency: 'USD',
      status: 'sent',
      due_date: due_date,
      issue_date: new Date().toISOString().split('T')[0],
      description: description || 'Subscription billing',
      payment_terms: 30
    };
    
    const { data, error } = await supabase
      .from('invoices')
      .insert([invoiceData])
      .select();

    if (error) {
      console.error('❌ Create invoice error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
    
    console.log('✅ Invoice created in Supabase:', data[0]);
    res.json({ success: true, data: data });
  } catch (error) {
    console.error('❌ Create invoice error:', error);
    res.status(500).json({ success: false, error: 'Failed to create invoice: ' + error.message });
  }
});

// ===== PAYMENT ROUTES =====
app.get('/api/payments', async (req, res) => {
  try {
    console.log('🚀 GET PAYMENTS API CALLED');
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        customers (
          name,
          email
        ),
        invoices (
          invoice_number
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Get payments error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    // Flatten data
    const formattedData = data.map(payment => ({
      ...payment,
      customer_name: payment.customers?.name || 'Unknown',
      customer_email: payment.customers?.email || '',
      invoice_number: payment.invoices?.invoice_number || '-'
    }));

    console.log(`✅ Retrieved ${data.length} payments from Supabase`);
    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error('❌ Get payments error:', error);
    res.status(500).json({ success: false, error: 'Failed to get payments: ' + error.message });
  }
});

app.post('/api/payments', async (req, res) => {
  try {
    const { customer_id, invoice_id, amount, payment_method, payment_date, notes } = req.body;
    console.log('🚀 CREATE PAYMENT API CALLED:', { customer_id, invoice_id, amount });
    
    if (!customer_id || !amount || !payment_method) {
      return res.status(400).json({ success: false, error: 'Customer ID, amount, and payment method are required' });
    }

    const paymentData = {
      customer_id: customer_id,
      invoice_id: invoice_id,
      amount: parseFloat(amount),
      currency: 'USD',
      payment_method: payment_method,
      payment_date: payment_date || new Date().toISOString().split('T')[0],
      transaction_reference: `TXN-${Date.now()}`,
      status: 'completed',
      notes: notes || ''
    };
    
    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData])
      .select();

    if (error) {
      console.error('❌ Create payment error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    // If payment is for an invoice, update invoice status
    if (invoice_id) {
      const { error: updateError } = await supabase
        .from('invoices')
        .update({ 
          status: 'paid', 
          paid_at: paymentData.payment_date 
        })
        .eq('id', invoice_id);

      if (updateError) {
        console.error('❌ Error updating invoice status:', updateError);
      } else {
        console.log('✅ Invoice status updated to paid');
      }
    }
    
    console.log('✅ Payment created in Supabase:', data[0]);
    res.json({ success: true, data: data });
  } catch (error) {
    console.error('❌ Create payment error:', error);
    res.status(500).json({ success: false, error: 'Failed to create payment: ' + error.message });
  }
});

// ===== HEALTH CHECK =====
app.get('/api/health', async (req, res) => {
  try {
    console.log('🚀 HEALTH CHECK API CALLED');
    
    // Test Supabase connection
    const { data, error } = await supabase
      .from('customers')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Health check failed:', error);
      return res.json({ 
        status: 'ERROR', 
        service: 'BILLZ API', 
        version: '1.0.0',
        database: 'Disconnected ❌',
        error: error.message
      });
    }

    console.log('✅ Health check successful');
    res.json({ 
      status: 'OK', 
      service: 'BILLZ API', 
      version: '1.0.0',
      database: 'Connected ✅ (Supabase)',
      timestamp: new Date().toISOString(),
      customers_in_db: data || 0,
      auth: 'Supabase Auth'
    });
  } catch (error) {
    console.error('❌ Health check failed:', error);
    res.json({ 
      status: 'ERROR', 
      service: 'BILLZ API', 
      version: '1.0.0',
      database: 'Disconnected ❌',
      error: error.message
    });
  }
});

// Serve frontend for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV !== 'production' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 BILLZ Server is running!
📍 Port: ${PORT}
🌍 Local: http://localhost:${PORT}
🗄️  Database: Supabase (Direct Client)
🔐 Auth: Supabase Authentication
💰 Features: Full Invoice & Payment System
⚡ Ready for operations!
  `);
});

module.exports = app;
