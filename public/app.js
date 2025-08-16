// BILLZ Application JavaScript - Full Dynamic Version
console.log('🚀 BILLZ App.js loaded - Full Dynamic Version 4.0');

// Supabase Configuration
const SUPABASE_URL = 'https://qqlshxvxeggabzybrbmr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxbHNoeHZ4ZWdnYWJ6eWJyYm1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzNTQ5NzMsImV4cCI6MjA3MDkzMDk3M30.v4IBDujoFryUuXo1NDOnxBflj0qf1stb2xPA115DsX8';

// Application State
let currentUser = null;
let currentSection = 'overview';
let dashboardStats = {
  totalCustomers: 0,
  activeSubscriptions: 0,
  monthlyRevenue: 0,
  overdueAmount: 0
};

// Application Data
const appData = {
  customers: [],
  subscriptions: [],
  invoices: [],
  payments: []
};

// Load Supabase from CDN
function loadSupabase() {
  if (typeof supabase === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = () => {
      window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('✅ Supabase client initialized');
    };
    document.head.appendChild(script);
  }
}

// DOM Manipulation Functions
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');
}

function showDashboard() {
  showPage('dashboardPage');
  showDashboardSection('overview');
  loadDashboardStats();
  initializeCharts();
}
function showDashboardSection(sectionId) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  document.querySelectorAll('.dashboard-section').forEach(section => {
    section.classList.remove('active');
  });
  
  document.getElementById(sectionId).classList.add('active');
  
  event?.target.closest('.nav-item')?.classList.add('active');
  
  switch(sectionId) {
    case 'overview':
      loadDashboardStats(); // ✅ ADD THIS LINE
      break;
    case 'customers':
      loadCustomersTable();
      break;
    case 'subscriptions':
      loadSubscriptionsTable();
      break;
    case 'invoices':
      loadInvoicesTable();
      break;
    case 'payments':
      loadPaymentsTable();
      break;
    case 'reports':
      loadReports();
      break;
  }
  
  currentSection = sectionId;
}


// Authentication Functions
function showLogin() {
  document.getElementById('loginModal').classList.add('active');
}

function showSignup() {
  document.getElementById('signupModal').classList.add('active');
}

function switchToLogin() {
  closeModal('signupModal');
  showLogin();
}

function switchToSignup() {
  closeModal('loginModal');
  showSignup();
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

function logout() {
  currentUser = null;
  showPage('landingPage');
  showNotification('Logged out successfully', 'info');
}

// LOAD DYNAMIC DASHBOARD STATS
async function loadDashboardStats() {
  try {
    console.log('📊 Loading dashboard stats...');
    const response = await fetch('/api/dashboard/stats');
    const result = await response.json();
    
    if (result.success) {
      dashboardStats = result.data;
      updateDashboardDisplay();
      console.log('✅ Dashboard stats loaded:', dashboardStats);
    } else {
      console.error('❌ Failed to load dashboard stats:', result.error);
      showNotification('Failed to load dashboard stats', 'error');
    }
  } catch (error) {
    console.error('❌ Error loading dashboard stats:', error);
    showNotification('Error loading dashboard stats', 'error');
  }
}

// UPDATE DASHBOARD DISPLAY WITH REAL DATA
function updateDashboardDisplay() {
  console.log('🔄 Updating dashboard display with stats:', dashboardStats);
  
  // Update metric cards using the correct selectors
  const totalCustomersElement = document.querySelector('.metric-value[data-label="customers"]');
  const activeSubscriptionsElement = document.querySelector('.metric-value[data-label="subscriptions"]');
  const monthlyRevenueElement = document.querySelector('.metric-value[data-label="revenue"]');
  const overdueAmountElement = document.querySelector('.metric-value[data-label="overdue"]');
  
  console.log('Found elements:', {
    customers: totalCustomersElement,
    subscriptions: activeSubscriptionsElement,
    revenue: monthlyRevenueElement,
    overdue: overdueAmountElement
  });
  
  if (totalCustomersElement) {
    totalCustomersElement.textContent = dashboardStats.totalCustomers;
    console.log('✅ Updated customers:', dashboardStats.totalCustomers);
  }
  if (activeSubscriptionsElement) {
    activeSubscriptionsElement.textContent = dashboardStats.activeSubscriptions;
    console.log('✅ Updated subscriptions:', dashboardStats.activeSubscriptions);
  }
  if (monthlyRevenueElement) {
    monthlyRevenueElement.textContent = `$${dashboardStats.monthlyRevenue}`;
    console.log('✅ Updated revenue:', `$${dashboardStats.monthlyRevenue}`);
  }
  if (overdueAmountElement) {
    overdueAmountElement.textContent = `$${dashboardStats.overdueAmount}`;
    console.log('✅ Updated overdue:', `$${dashboardStats.overdueAmount}`);
  }
  
  // Fallback: If elements don't have data-label, find by other means
  const metricValues = document.querySelectorAll('.metric-value');
  if (metricValues.length >= 4) {
    metricValues[0].textContent = dashboardStats.totalCustomers;
    metricValues[1].textContent = dashboardStats.activeSubscriptions;  
    metricValues[2].textContent = `$${dashboardStats.monthlyRevenue}`;
    metricValues[3].textContent = `$${dashboardStats.overdueAmount}`;
    console.log('✅ Updated via fallback method');
  }
}

// Data Loading Functions
async function loadCustomersTable() {
  try {
    console.log('📥 Loading customers...');
    const response = await fetch('/api/customers');
    const result = await response.json();
    
    const tbody = document.getElementById('customersTableBody');
    tbody.innerHTML = '';
    
    if (result.success && result.data) {
      appData.customers = result.data;
      result.data.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${customer.name}</td>
          <td>${customer.email}</td>
          <td>${customer.company || '-'}</td>
          <td><span class="status-badge status-${customer.status}">${customer.status}</span></td>
          <td>$${customer.total_revenue || 0}</td>
          <td>
            <div class="action-buttons">
              <button class="action-btn action-btn--edit" onclick="editCustomer(${customer.id})">Edit</button>
              <button class="action-btn action-btn--delete" onclick="deleteCustomer(${customer.id})">Delete</button>
            </div>
          </td>
        `;
        tbody.appendChild(row);
      });
      console.log(`✅ Loaded ${result.data.length} customers`);
    }
  } catch (error) {
    console.error('❌ Error loading customers:', error);
    showNotification('Error loading customers', 'error');
  }
}

async function loadSubscriptionsTable() {
  try {
    console.log('📥 Loading subscriptions...');
    const response = await fetch('/api/subscriptions');
    const result = await response.json();
    
    const tbody = document.getElementById('subscriptionsTableBody');
    tbody.innerHTML = '';
    
    if (result.success && result.data) {
      appData.subscriptions = result.data;
      result.data.forEach(subscription => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${subscription.customer_name || 'Unknown'}</td>
          <td>${subscription.plan_name}</td>
          <td>$${subscription.plan_price}</td>
          <td>${subscription.billing_cycle}</td>
          <td><span class="status-badge status-${subscription.status}">${subscription.status}</span></td>
          <td>${subscription.next_billing_date || '-'}</td>
          <td>
            <div class="action-buttons">
              <button class="action-btn action-btn--edit" onclick="editSubscription(${subscription.id})">Edit</button>
              <button class="action-btn action-btn--delete" onclick="cancelSubscription(${subscription.id})">Cancel</button>
            </div>
          </td>
        `;
        tbody.appendChild(row);
      });
      console.log(`✅ Loaded ${result.data.length} subscriptions`);
    }
  } catch (error) {
    console.error('❌ Error loading subscriptions:', error);
    showNotification('Error loading subscriptions', 'error');
  }
}

async function loadInvoicesTable() {
  try {
    console.log('📥 Loading invoices...');
    const response = await fetch('/api/invoices');
    const result = await response.json();
    
    const tbody = document.getElementById('invoicesTableBody');
    tbody.innerHTML = '';
    
    if (result.success && result.data) {
      appData.invoices = result.data;
      result.data.forEach(invoice => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${invoice.invoice_number}</td>
          <td>${invoice.customer_name || 'Unknown'}</td>
          <td>$${invoice.total_amount}</td>
          <td>${invoice.due_date}</td>
          <td><span class="status-badge status-${invoice.status}">${invoice.status}</span></td>
          <td>
            <div class="action-buttons">
              <button class="action-btn action-btn--edit" onclick="viewInvoice(${invoice.id})">View</button>
              ${invoice.status !== 'paid' ? `<button class="action-btn action-btn--success" onclick="recordPayment(${invoice.id})">Pay</button>` : ''}
            </div>
          </td>
        `;
        tbody.appendChild(row);
      });
      console.log(`✅ Loaded ${result.data.length} invoices`);
    }
  } catch (error) {
    console.error('❌ Error loading invoices:', error);
    showNotification('Error loading invoices', 'error');
  }
}

async function loadPaymentsTable() {
  try {
    console.log('📥 Loading payments...');
    const response = await fetch('/api/payments');
    const result = await response.json();
    
    const tbody = document.getElementById('paymentsTableBody');
    tbody.innerHTML = '';
    
    if (result.success && result.data) {
      appData.payments = result.data;
      result.data.forEach(payment => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${payment.customer_name || 'Unknown'}</td>
          <td>$${payment.amount}</td>
          <td>${payment.payment_method}</td>
          <td>${payment.payment_date}</td>
          <td><span class="status-badge status-${payment.status}">${payment.status}</span></td>
          <td>${payment.transaction_reference || '-'}</td>
        `;
        tbody.appendChild(row);
      });
      console.log(`✅ Loaded ${result.data.length} payments`);
    }
  } catch (error) {
    console.error('❌ Error loading payments:', error);
    showNotification('Error loading payments', 'error');
  }
}

// Modal Functions
function openCustomerModal() {
  document.getElementById('customerModal').classList.add('active');
}

function openSubscriptionModal() {
  document.getElementById('subscriptionModal').classList.add('active');
  populateCustomerDropdowns();
}

function openInvoiceModal() {
  document.getElementById('invoiceModal').classList.add('active');
  populateCustomerDropdowns();
  populateSubscriptionDropdowns();
}

function openPaymentModal() {
  document.getElementById('paymentModal').classList.add('active');
  populateCustomerDropdowns();
  populateInvoiceDropdowns();
}

async function populateCustomerDropdowns() {
  try {
    const response = await fetch('/api/customers');
    const result = await response.json();
    
    // For subscriptions
    const subscriptionCustomerSelect = document.getElementById('subscriptionCustomer');
    if (subscriptionCustomerSelect && result.success && result.data) {
      subscriptionCustomerSelect.innerHTML = '<option value="">Select Customer</option>';
      result.data.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.textContent = `${customer.name} (${customer.email})`;
        subscriptionCustomerSelect.appendChild(option);
      });
    }
    
    // For invoices
    const invoiceCustomerSelect = document.getElementById('invoiceCustomer');
    if (invoiceCustomerSelect && result.success && result.data) {
      invoiceCustomerSelect.innerHTML = '<option value="">Select Customer</option>';
      result.data.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.textContent = `${customer.name} (${customer.email})`;
        invoiceCustomerSelect.appendChild(option);
      });
    }
    
    // For payments
    const paymentCustomerSelect = document.getElementById('paymentCustomer');
    if (paymentCustomerSelect && result.success && result.data) {
      paymentCustomerSelect.innerHTML = '<option value="">Select Customer</option>';
      result.data.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.textContent = `${customer.name} (${customer.email})`;
        paymentCustomerSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error('❌ Error loading customers for dropdown:', error);
  }
}

async function populateSubscriptionDropdowns() {
  try {
    const response = await fetch('/api/subscriptions');
    const result = await response.json();
    
    const subscriptionSelect = document.getElementById('invoiceSubscription');
    if (subscriptionSelect && result.success && result.data) {
      subscriptionSelect.innerHTML = '<option value="">Select Subscription (Optional)</option>';
      result.data.forEach(subscription => {
        const option = document.createElement('option');
        option.value = subscription.id;
        option.textContent = `${subscription.customer_name} - ${subscription.plan_name}`;
        subscriptionSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error('❌ Error loading subscriptions for dropdown:', error);
  }
}

async function populateInvoiceDropdowns() {
  try {
    const response = await fetch('/api/invoices');
    const result = await response.json();
    
    const invoiceSelect = document.getElementById('paymentInvoice');
    if (invoiceSelect && result.success && result.data) {
      invoiceSelect.innerHTML = '<option value="">Select Invoice (Optional)</option>';
      result.data.filter(invoice => invoice.status !== 'paid').forEach(invoice => {
        const option = document.createElement('option');
        option.value = invoice.id;
        option.textContent = `${invoice.invoice_number} - $${invoice.total_amount}`;
        invoiceSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error('❌ Error loading invoices for dropdown:', error);
  }
}

// CRUD Operations
function editCustomer(id) {
  const customer = appData.customers.find(c => c.id === id);
  if (customer) {
    document.getElementById('customerName').value = customer.name;
    document.getElementById('customerEmail').value = customer.email;
    document.getElementById('customerCompany').value = customer.company || '';
    document.getElementById('customerStreet').value = customer.address_street || '';
    document.getElementById('customerCity').value = customer.address_city || '';
    document.getElementById('customerState').value = customer.address_state || '';
    document.getElementById('customerZip').value = customer.address_zip || '';
    
    document.getElementById('customerModalTitle').textContent = 'Edit Customer';
    openCustomerModal();
  }
}

async function deleteCustomer(id) {
  if (confirm('Are you sure you want to delete this customer?')) {
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        await loadCustomersTable();
        await loadDashboardStats(); // Refresh dashboard
        showNotification('Customer deleted successfully', 'success');
      } else {
        showNotification(result.error || 'Failed to delete customer', 'error');
      }
    } catch (error) {
      console.error('❌ Error deleting customer:', error);
      showNotification('Error deleting customer', 'error');
    }
  }
}

function editSubscription(id) {
  showNotification('Subscription editing coming soon!', 'info');
}

function cancelSubscription(id) {
  if (confirm('Are you sure you want to cancel this subscription?')) {
    const subscription = appData.subscriptions.find(s => s.id === id);
    if (subscription) {
      subscription.status = 'cancelled';
      loadSubscriptionsTable();
      loadDashboardStats(); // Refresh dashboard
      showNotification('Subscription cancelled successfully', 'success');
    }
  }
}

function viewInvoice(id) {
  const invoice = appData.invoices.find(i => i.id === id);
  if (invoice) {
    alert(`Invoice Details:\n\nNumber: ${invoice.invoice_number}\nAmount: $${invoice.total_amount}\nDue Date: ${invoice.due_date}\nStatus: ${invoice.status}`);
  }
}

async function recordPayment(invoiceId) {
  const invoice = appData.invoices.find(i => i.id === invoiceId);
  if (!invoice) {
    showNotification('Invoice not found', 'error');
    return;
  }
  
  if (confirm(`Record payment of $${invoice.total_amount} for ${invoice.invoice_number}?`)) {
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: invoice.customer_id,
          invoice_id: invoice.id,
          amount: invoice.total_amount,
          payment_method: 'manual',
          notes: `Payment for ${invoice.invoice_number}`
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        await loadInvoicesTable();
        await loadPaymentsTable();
        await loadDashboardStats(); // Refresh dashboard
        showNotification('Payment recorded successfully', 'success');
      } else {
        showNotification(result.error || 'Failed to record payment', 'error');
      }
    } catch (error) {
      console.error('❌ Error recording payment:', error);
      showNotification('Error recording payment', 'error');
    }
  }
}

// Utility Functions
function calculateNextBilling(startDate, cycle) {
  const date = new Date(startDate);
  switch(cycle) {
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  return date.toISOString().split('T')[0];
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.textContent = message;
  
  document.getElementById('notifications').appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Charts Initialization
function initializeCharts() {
  // Revenue Chart with dynamic data
  const revenueCtx = document.getElementById('revenueChart');
  if (revenueCtx) {
    new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        datasets: [{
          label: 'Monthly Revenue',
          data: [0, 0, 0, 0, dashboardStats.monthlyRevenue],
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: '#f8fafc' }
          }
        },
        scales: {
          x: { 
            ticks: { color: '#cbd5e1' },
            grid: { color: '#475569' }
          },
          y: { 
            ticks: { color: '#cbd5e1' },
            grid: { color: '#475569' }
          }
        }
      }
    });
  }
  
  // Subscription Chart with dynamic data
  const subscriptionCtx = document.getElementById('subscriptionChart');
  if (subscriptionCtx) {
    new Chart(subscriptionCtx, {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Trial', 'Cancelled'],
        datasets: [{
          data: [dashboardStats.activeSubscriptions, 0, 0],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: '#f8fafc' }
          }
        }
      }
    });
  }
}

function loadReports() {
  // Revenue Report Chart with dynamic data
  const revenueReportCtx = document.getElementById('revenueReportChart');
  if (revenueReportCtx) {
    new Chart(revenueReportCtx, {
      type: 'bar',
      data: {
        labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        datasets: [{
          label: 'Monthly Revenue',
          data: [0, 0, 0, 0, dashboardStats.monthlyRevenue],
          backgroundColor: '#8b5cf6'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: '#f8fafc' } }
        },
        scales: {
          x: { 
            ticks: { color: '#cbd5e1' },
            grid: { color: '#475569' }
          },
          y: { 
            ticks: { color: '#cbd5e1' },
            grid: { color: '#475569' }
          }
        }
      }
    });
  }
  
  // Customer Growth Chart
  const customerGrowthCtx = document.getElementById('customerGrowthChart');
  if (customerGrowthCtx) {
    new Chart(customerGrowthCtx, {
      type: 'line',
      data: {
        labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        datasets: [{
          label: 'Total Customers',
          data: [0, 0, 0, 0, dashboardStats.totalCustomers],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: '#f8fafc' } }
        },
        scales: {
          x: { 
            ticks: { color: '#cbd5e1' },
            grid: { color: '#475569' }
          },
          y: { 
            ticks: { color: '#cbd5e1' },
            grid: { color: '#475569' }
          }
        }
      }
    });
  }
}

// Animation Functions
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Initializing BILLZ Application - Full Dynamic Version...');
  
  loadSupabase();
  initializeAnimations();
  
  // ===== FORM HANDLERS =====
  
  // Login Form
  document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        currentUser = data.user;
        closeModal('loginModal');
        showDashboard();
        showNotification('Login successful!', 'success');
      } else {
        showNotification(data.error || 'Login failed', 'error');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      showNotification('Login failed: ' + error.message, 'error');
    }
  });
  
  // Signup Form
  document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const company = document.getElementById('signupCompany').value;
    const password = document.getElementById('signupPassword').value;
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        currentUser = data.user;
        closeModal('signupModal');
        showDashboard();
        showNotification('Account created successfully!', 'success');
      } else {
        showNotification(data.error || 'Registration failed', 'error');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      showNotification('Registration failed: ' + error.message, 'error');
    }
  });
  
  // Customer Form
  document.getElementById('customerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const customerData = {
      name: document.getElementById('customerName').value,
      email: document.getElementById('customerEmail').value,
      company: document.getElementById('customerCompany').value,
      address_street: document.getElementById('customerStreet').value,
      address_city: document.getElementById('customerCity').value,
      address_state: document.getElementById('customerState').value,
      address_zip: document.getElementById('customerZip').value
    };
    
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        closeModal('customerModal');
        await loadCustomersTable();
        await loadDashboardStats(); // Refresh dashboard stats
        showNotification('Customer saved successfully!', 'success');
        document.getElementById('customerForm').reset();
        document.getElementById('customerModalTitle').textContent = 'Add New Customer';
      } else {
        showNotification(result.error || 'Failed to save customer', 'error');
      }
    } catch (error) {
      console.error('❌ Error saving customer:', error);
      showNotification('Error saving customer', 'error');
    }
  });
  
  // Subscription Form
  document.getElementById('subscriptionForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const subscriptionData = {
      customer_id: parseInt(document.getElementById('subscriptionCustomer').value),
      plan_name: document.getElementById('subscriptionPlan').value,
      plan_price: parseFloat(document.getElementById('subscriptionAmount').value),
      billing_cycle: document.getElementById('subscriptionCycle').value,
      status: document.getElementById('subscriptionTrial').checked ? 'trial' : 'active',
      start_date: document.getElementById('subscriptionStartDate').value,
      trial_start: document.getElementById('subscriptionTrial').checked ? document.getElementById('trialStart').value : null,
      trial_end: document.getElementById('subscriptionTrial').checked ? document.getElementById('trialEnd').value : null
    };
    
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscriptionData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        closeModal('subscriptionModal');
        await loadSubscriptionsTable();
        await loadDashboardStats(); // Refresh dashboard stats
        showNotification('Subscription created successfully!', 'success');
        document.getElementById('subscriptionForm').reset();
      } else {
        showNotification(result.error || 'Failed to create subscription', 'error');
      }
    } catch (error) {
      console.error('❌ Error creating subscription:', error);
      showNotification('Error creating subscription', 'error');
    }
  });
  
  // Invoice Form
  if (document.getElementById('invoiceForm')) {
    document.getElementById('invoiceForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const invoiceData = {
        customer_id: parseInt(document.getElementById('invoiceCustomer').value),
        subscription_id: parseInt(document.getElementById('invoiceSubscription').value) || null,
        amount: parseFloat(document.getElementById('invoiceAmount').value),
        description: document.getElementById('invoiceDescription').value,
        due_date: document.getElementById('invoiceDueDate').value
      };
      
      try {
        const response = await fetch('/api/invoices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(invoiceData)
        });
        
        const result = await response.json();
        
        if (result.success) {
          closeModal('invoiceModal');
          await loadInvoicesTable();
          await loadDashboardStats(); // Refresh dashboard stats
          showNotification('Invoice created successfully!', 'success');
          document.getElementById('invoiceForm').reset();
        } else {
          showNotification(result.error || 'Failed to create invoice', 'error');
        }
      } catch (error) {
        console.error('❌ Error creating invoice:', error);
        showNotification('Error creating invoice', 'error');
      }
    });
  }
  
  // Payment Form
  if (document.getElementById('paymentForm')) {
    document.getElementById('paymentForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const paymentData = {
        customer_id: parseInt(document.getElementById('paymentCustomer').value),
        invoice_id: parseInt(document.getElementById('paymentInvoice').value) || null,
        amount: parseFloat(document.getElementById('paymentAmount').value),
        payment_method: document.getElementById('paymentMethod').value,
        payment_date: document.getElementById('paymentDate').value,
        notes: document.getElementById('paymentNotes').value
      };
      
      try {
        const response = await fetch('/api/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(paymentData)
        });
        
        const result = await response.json();
        
        if (result.success) {
          closeModal('paymentModal');
          await loadPaymentsTable();
          await loadInvoicesTable(); // Refresh invoices in case status changed
          await loadDashboardStats(); // Refresh dashboard stats
          showNotification('Payment recorded successfully!', 'success');
          document.getElementById('paymentForm').reset();
        } else {
          showNotification(result.error || 'Failed to record payment', 'error');
        }
      } catch (error) {
        console.error('❌ Error recording payment:', error);
        showNotification('Error recording payment', 'error');
      }
    });
  }
  
  // Plan selection change handler
  if (document.getElementById('subscriptionPlan')) {
    document.getElementById('subscriptionPlan').addEventListener('change', function() {
      const selectedOption = this.selectedOptions[0];
      if (selectedOption) {
        const price = selectedOption.dataset.price;
        document.getElementById('subscriptionAmount').value = price;
      }
    });
  }
  
  // Trial checkbox handler
  if (document.getElementById('subscriptionTrial')) {
    document.getElementById('subscriptionTrial').addEventListener('change', function() {
      const trialFields = document.getElementById('trialFields');
      if (trialFields) {
        trialFields.style.display = this.checked ? 'block' : 'none';
      }
    });
  }
  
  // Close modals when clicking outside
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
  
  // Set default dates
  const today = new Date().toISOString().split('T')[0];
  if (document.getElementById('subscriptionStartDate')) {
    document.getElementById('subscriptionStartDate').value = today;
  }
  if (document.getElementById('paymentDate')) {
    document.getElementById('paymentDate').value = today;
  }
  
  // Set default invoice due date (30 days from today)
  if (document.getElementById('invoiceDueDate')) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    document.getElementById('invoiceDueDate').value = dueDate.toISOString().split('T')[0];
  }
  
  console.log('✅ BILLZ Application initialized - Full Dynamic Version!');
});
