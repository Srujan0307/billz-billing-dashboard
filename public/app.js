// BILLZ Application JavaScript

// Application State
let currentUser = null;
let currentSection = 'overview';

// Application Data
const appData = {
  customers: [
    {
      id: 1,
      name: "TechCorp Solutions",
      email: "billing@techcorp.com",
      company: "TechCorp Inc",
      address_street: "123 Tech Street",
      address_city: "San Francisco",
      address_state: "CA",
      address_zip: "94105",
      address_country: "USA",
      status: "active",
      created_at: "2024-01-15",
      total_revenue: 2388
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "founder@startupflow.io",
      company: "StartupFlow",
      address_street: "456 Innovation Ave",
      address_city: "Austin",
      address_state: "TX",
      address_zip: "78701",
      address_country: "USA",
      status: "active",
      created_at: "2024-03-22",
      total_revenue: 948
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "admin@digitalmarketing.com",
      company: "Digital Marketing Pro",
      address_street: "789 Marketing Blvd",
      address_city: "New York",
      address_state: "NY",
      address_zip: "10001",
      address_country: "USA",
      status: "trial",
      created_at: "2025-01-01",
      total_revenue: 0
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      email: "billing@ecommerceplus.com",
      company: "E-commerce Plus",
      address_street: "321 Commerce Dr",
      address_city: "Miami",
      address_state: "FL",
      address_zip: "33101",
      address_country: "USA",
      status: "active",
      created_at: "2024-06-10",
      total_revenue: 203
    },
    {
      id: 5,
      name: "David Kim",
      email: "accounts@cloudsync.tech",
      company: "CloudSync Technologies",
      address_street: "555 Cloud Lane",
      address_city: "Seattle",
      address_state: "WA",
      address_zip: "98101",
      address_country: "USA",
      status: "active",
      created_at: "2024-02-28",
      total_revenue: 2189
    }
  ],
  subscriptions: [
    {
      id: 1,
      customer_id: 1,
      plan_name: "Enterprise",
      plan_price: 199,
      billing_cycle: "monthly",
      status: "active",
      start_date: "2024-01-15",
      next_billing_date: "2025-02-15",
      trial_start: null,
      trial_end: null,
      created_at: "2024-01-15"
    },
    {
      id: 2,
      customer_id: 2,
      plan_name: "Pro",
      plan_price: 79,
      billing_cycle: "monthly",
      status: "active",
      start_date: "2024-03-22",
      next_billing_date: "2025-02-10",
      trial_start: null,
      trial_end: null,
      created_at: "2024-03-22"
    },
    {
      id: 3,
      customer_id: 3,
      plan_name: "Pro",
      plan_price: 79,
      billing_cycle: "monthly",
      status: "trial",
      start_date: "2025-01-01",
      next_billing_date: "2025-01-31",
      trial_start: "2025-01-01",
      trial_end: "2025-01-31",
      created_at: "2025-01-01"
    },
    {
      id: 4,
      customer_id: 4,
      plan_name: "Basic",
      plan_price: 29,
      billing_cycle: "monthly",
      status: "active",
      start_date: "2024-06-10",
      next_billing_date: "2025-02-12",
      trial_start: null,
      trial_end: null,
      created_at: "2024-06-10"
    },
    {
      id: 5,
      customer_id: 5,
      plan_name: "Enterprise",
      plan_price: 199,
      billing_cycle: "monthly",
      status: "active",
      start_date: "2024-02-28",
      next_billing_date: "2025-02-14",
      trial_start: null,
      trial_end: null,
      created_at: "2024-02-28"
    }
  ],
  invoices: [
    {
      id: 1001,
      customer_id: 1,
      subscription_id: 1,
      invoice_number: "INV-1001",
      amount: 199,
      tax_amount: 19.9,
      total_amount: 218.9,
      due_date: "2025-01-15",
      status: "paid",
      paid_at: "2025-01-15",
      created_at: "2025-01-01"
    },
    {
      id: 1002,
      customer_id: 2,
      subscription_id: 2,
      invoice_number: "INV-1002",
      amount: 79,
      tax_amount: 7.9,
      total_amount: 86.9,
      due_date: "2025-01-10",
      status: "paid",
      paid_at: "2025-01-10",
      created_at: "2024-12-27"
    },
    {
      id: 1003,
      customer_id: 4,
      subscription_id: 4,
      invoice_number: "INV-1003",
      amount: 29,
      tax_amount: 2.9,
      total_amount: 31.9,
      due_date: "2025-01-12",
      status: "paid",
      paid_at: "2025-01-12",
      created_at: "2024-12-29"
    },
    {
      id: 1004,
      customer_id: 5,
      subscription_id: 5,
      invoice_number: "INV-1004",
      amount: 199,
      tax_amount: 19.9,
      total_amount: 218.9,
      due_date: "2025-01-14",
      status: "overdue",
      paid_at: null,
      created_at: "2024-12-31"
    },
    {
      id: 1005,
      customer_id: 1,
      subscription_id: 1,
      invoice_number: "INV-1005",
      amount: 199,
      tax_amount: 19.9,
      total_amount: 218.9,
      due_date: "2025-02-15",
      status: "sent",
      paid_at: null,
      created_at: "2025-01-15"
    }
  ],
  payments: [
    {
      id: 2001,
      customer_id: 1,
      invoice_id: 1001,
      amount: 218.9,
      payment_method: "Credit Card",
      payment_date: "2025-01-15",
      transaction_reference: "txn_123abc",
      status: "completed",
      notes: "Automatic payment",
      created_at: "2025-01-15"
    },
    {
      id: 2002,
      customer_id: 2,
      invoice_id: 1002,
      amount: 86.9,
      payment_method: "Bank Transfer",
      payment_date: "2025-01-10",
      transaction_reference: "txn_456def",
      status: "completed",
      notes: "Manual payment",
      created_at: "2025-01-10"
    },
    {
      id: 2003,
      customer_id: 4,
      invoice_id: 1003,
      amount: 31.9,
      payment_method: "Credit Card",
      payment_date: "2025-01-12",
      transaction_reference: "txn_789ghi",
      status: "completed",
      notes: "Automatic payment",
      created_at: "2025-01-12"
    }
  ]
};

// DOM Manipulation Functions
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Show selected page
  document.getElementById(pageId).classList.add('active');
}

function showDashboard() {
  showPage('dashboardPage');
  showDashboardSection('overview');
  initializeCharts();
}

function showDashboardSection(sectionId) {
  // Update navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Hide all sections
  document.querySelectorAll('.dashboard-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Show selected section
  document.getElementById(sectionId).classList.add('active');
  
  // Update active nav item
  event?.target.closest('.nav-item')?.classList.add('active');
  
  // Load section-specific data
  switch(sectionId) {
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

// Data Loading Functions
function loadCustomersTable() {
  const tbody = document.getElementById('customersTableBody');
  tbody.innerHTML = '';
  
  appData.customers.forEach(customer => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${customer.name}</td>
      <td>${customer.email}</td>
      <td>${customer.company || '-'}</td>
      <td><span class="status-badge status-${customer.status}">${customer.status}</span></td>
      <td>$${customer.total_revenue}</td>
      <td>
        <div class="action-buttons">
          <button class="action-btn action-btn--edit" onclick="editCustomer(${customer.id})">Edit</button>
          <button class="action-btn action-btn--delete" onclick="deleteCustomer(${customer.id})">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function loadSubscriptionsTable() {
  const tbody = document.getElementById('subscriptionsTableBody');
  tbody.innerHTML = '';
  
  appData.subscriptions.forEach(subscription => {
    const customer = appData.customers.find(c => c.id === subscription.customer_id);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${customer ? customer.name : 'Unknown'}</td>
      <td>${subscription.plan_name}</td>
      <td>$${subscription.plan_price}</td>
      <td>${subscription.billing_cycle}</td>
      <td><span class="status-badge status-${subscription.status}">${subscription.status}</span></td>
      <td>${subscription.next_billing_date}</td>
      <td>
        <div class="action-buttons">
          <button class="action-btn action-btn--edit" onclick="editSubscription(${subscription.id})">Edit</button>
          <button class="action-btn action-btn--delete" onclick="cancelSubscription(${subscription.id})">Cancel</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function loadInvoicesTable() {
  const tbody = document.getElementById('invoicesTableBody');
  tbody.innerHTML = '';
  
  appData.invoices.forEach(invoice => {
    const customer = appData.customers.find(c => c.id === invoice.customer_id);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${invoice.invoice_number}</td>
      <td>${customer ? customer.name : 'Unknown'}</td>
      <td>$${invoice.total_amount}</td>
      <td>${invoice.due_date}</td>
      <td><span class="status-badge status-${invoice.status}">${invoice.status}</span></td>
      <td>
        <div class="action-buttons">
          <button class="action-btn action-btn--edit" onclick="viewInvoice(${invoice.id})">View</button>
          ${invoice.status !== 'paid' ? `<button class="action-btn action-btn--edit" onclick="recordPayment(${invoice.id})">Pay</button>` : ''}
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function loadPaymentsTable() {
  const tbody = document.getElementById('paymentsTableBody');
  tbody.innerHTML = '';
  
  appData.payments.forEach(payment => {
    const customer = appData.customers.find(c => c.id === payment.customer_id);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${customer ? customer.name : 'Unknown'}</td>
      <td>$${payment.amount}</td>
      <td>${payment.payment_method}</td>
      <td>${payment.payment_date}</td>
      <td><span class="status-badge status-${payment.status}">${payment.status}</span></td>
      <td>${payment.transaction_reference}</td>
    `;
    tbody.appendChild(row);
  });
}

// Modal Functions
function openCustomerModal() {
  document.getElementById('customerModal').classList.add('active');
  populateCustomerDropdowns();
}

function openSubscriptionModal() {
  document.getElementById('subscriptionModal').classList.add('active');
  populateCustomerDropdowns();
}

function openInvoiceModal() {
  // Would open invoice modal if implemented
  showNotification('Invoice creation coming soon!', 'info');
}

function openPaymentModal() {
  // Would open payment modal if implemented
  showNotification('Payment recording coming soon!', 'info');
}

function populateCustomerDropdowns() {
  const customerSelect = document.getElementById('subscriptionCustomer');
  if (customerSelect) {
    customerSelect.innerHTML = '<option value="">Select Customer</option>';
    appData.customers.forEach(customer => {
      const option = document.createElement('option');
      option.value = customer.id;
      option.textContent = customer.name;
      customerSelect.appendChild(option);
    });
  }
}

// CRUD Operations
function editCustomer(id) {
  const customer = appData.customers.find(c => c.id === id);
  if (customer) {
    // Populate form with customer data
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

function deleteCustomer(id) {
  if (confirm('Are you sure you want to delete this customer?')) {
    appData.customers = appData.customers.filter(c => c.id !== id);
    loadCustomersTable();
    showNotification('Customer deleted successfully', 'success');
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
      showNotification('Subscription cancelled successfully', 'success');
    }
  }
}

function viewInvoice(id) {
  showNotification('Invoice viewer coming soon!', 'info');
}

function recordPayment(id) {
  const invoice = appData.invoices.find(i => i.id === id);
  if (invoice && confirm(`Record payment of $${invoice.total_amount} for ${invoice.invoice_number}?`)) {
    // Create payment record
    const payment = {
      id: Math.max(...appData.payments.map(p => p.id)) + 1,
      customer_id: invoice.customer_id,
      invoice_id: invoice.id,
      amount: invoice.total_amount,
      payment_method: 'Manual Entry',
      payment_date: new Date().toISOString().split('T')[0],
      transaction_reference: `TXN-${Date.now()}`,
      status: 'completed',
      notes: 'Manual payment entry',
      created_at: new Date().toISOString().split('T')[0]
    };
    
    appData.payments.push(payment);
    invoice.status = 'paid';
    invoice.paid_at = new Date().toISOString().split('T')[0];
    
    loadInvoicesTable();
    showNotification('Payment recorded successfully', 'success');
  }
}

// Form Handlers
document.addEventListener('DOMContentLoaded', function() {
  // Login Form
  document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
      // Simulate API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        currentUser = data.user;
        closeModal('loginModal');
        showDashboard();
        showNotification('Login successful!', 'success');
      } else {
        showNotification('Login failed. Please try again.', 'error');
      }
    } catch (error) {
      // Fallback for demo
      currentUser = { id: 1, name: 'Demo User', email: email };
      closeModal('loginModal');
      showDashboard();
      showNotification('Login successful! (Demo Mode)', 'success');
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
      // Simulate API call
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, company, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        currentUser = data.user;
        closeModal('signupModal');
        showDashboard();
        showNotification('Account created successfully!', 'success');
      } else {
        showNotification('Registration failed. Please try again.', 'error');
      }
    } catch (error) {
      // Fallback for demo
      currentUser = { id: 1, name: name, email: email, company: company };
      closeModal('signupModal');
      showDashboard();
      showNotification('Account created successfully! (Demo Mode)', 'success');
    }
  });
  
  // Customer Form
  document.getElementById('customerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const customerData = {
      name: document.getElementById('customerName').value,
      email: document.getElementById('customerEmail').value,
      company: document.getElementById('customerCompany').value,
      address_street: document.getElementById('customerStreet').value,
      address_city: document.getElementById('customerCity').value,
      address_state: document.getElementById('customerState').value,
      address_zip: document.getElementById('customerZip').value,
      address_country: 'USA',
      status: 'active',
      created_at: new Date().toISOString().split('T')[0],
      total_revenue: 0
    };
    
    // Add or update customer
    if (document.getElementById('customerModalTitle').textContent === 'Edit Customer') {
      // Update existing customer
      const index = appData.customers.findIndex(c => c.email === customerData.email);
      if (index !== -1) {
        customerData.id = appData.customers[index].id;
        customerData.total_revenue = appData.customers[index].total_revenue;
        appData.customers[index] = customerData;
      }
    } else {
      // Add new customer
      customerData.id = Math.max(...appData.customers.map(c => c.id)) + 1;
      appData.customers.push(customerData);
    }
    
    closeModal('customerModal');
    loadCustomersTable();
    showNotification('Customer saved successfully!', 'success');
    
    // Reset form
    document.getElementById('customerForm').reset();
    document.getElementById('customerModalTitle').textContent = 'Add New Customer';
  });
  
  // Subscription Form
  document.getElementById('subscriptionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const subscriptionData = {
      id: Math.max(...appData.subscriptions.map(s => s.id)) + 1,
      customer_id: parseInt(document.getElementById('subscriptionCustomer').value),
      plan_name: document.getElementById('subscriptionPlan').value,
      plan_price: parseFloat(document.getElementById('subscriptionAmount').value),
      billing_cycle: document.getElementById('subscriptionCycle').value,
      status: document.getElementById('subscriptionTrial').checked ? 'trial' : 'active',
      start_date: document.getElementById('subscriptionStartDate').value,
      next_billing_date: calculateNextBilling(document.getElementById('subscriptionStartDate').value, document.getElementById('subscriptionCycle').value),
      trial_start: document.getElementById('subscriptionTrial').checked ? document.getElementById('trialStart').value : null,
      trial_end: document.getElementById('subscriptionTrial').checked ? document.getElementById('trialEnd').value : null,
      created_at: new Date().toISOString().split('T')[0]
    };
    
    appData.subscriptions.push(subscriptionData);
    closeModal('subscriptionModal');
    loadSubscriptionsTable();
    showNotification('Subscription created successfully!', 'success');
    
    // Reset form
    document.getElementById('subscriptionForm').reset();
  });
  
  // Plan selection change handler
  document.getElementById('subscriptionPlan').addEventListener('change', function() {
    const selectedOption = this.selectedOptions[0];
    if (selectedOption) {
      const price = selectedOption.dataset.price;
      document.getElementById('subscriptionAmount').value = price;
    }
  });
  
  // Trial checkbox handler
  document.getElementById('subscriptionTrial').addEventListener('change', function() {
    const trialFields = document.getElementById('trialFields');
    trialFields.style.display = this.checked ? 'block' : 'none';
  });
});

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
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Charts Initialization
function initializeCharts() {
  // Revenue Chart
  const revenueCtx = document.getElementById('revenueChart');
  if (revenueCtx) {
    new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        datasets: [{
          label: 'Monthly Revenue',
          data: [380, 420, 465, 489, 506],
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
  
  // Subscription Chart
  const subscriptionCtx = document.getElementById('subscriptionChart');
  if (subscriptionCtx) {
    new Chart(subscriptionCtx, {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Trial', 'Cancelled'],
        datasets: [{
          data: [4, 1, 0],
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

// Load reports
function loadReports() {
  // Revenue Report Chart
  const revenueReportCtx = document.getElementById('revenueReportChart');
  if (revenueReportCtx) {
    new Chart(revenueReportCtx, {
      type: 'bar',
      data: {
        labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        datasets: [{
          label: 'Monthly Revenue',
          data: [380, 420, 465, 489, 506],
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
          data: [18, 22, 25, 28, 32],
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
  
  // Overdue Invoices List
  const overdueList = document.getElementById('overdueInvoicesList');
  if (overdueList) {
    const overdueInvoices = appData.invoices.filter(inv => inv.status === 'overdue');
    
    if (overdueInvoices.length === 0) {
      overdueList.innerHTML = '<p style="color: #10b981;">No overdue invoices! 🎉</p>';
    } else {
      overdueList.innerHTML = overdueInvoices.map(invoice => {
        const customer = appData.customers.find(c => c.id === invoice.customer_id);
        return `
          <div style="padding: 10px; background: var(--bg-primary); border-radius: 4px; margin-bottom: 8px;">
            <div style="font-weight: 600; color: var(--text-primary);">${invoice.invoice_number}</div>
            <div style="color: var(--text-secondary); font-size: 0.875rem;">${customer?.name || 'Unknown Customer'}</div>
            <div style="color: var(--error-color); font-weight: 500;">$${invoice.total_amount} - Due: ${invoice.due_date}</div>
          </div>
        `;
      }).join('');
    }
  }
}

// Animation Functions
function initializeAnimations() {
  // Scroll animations
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
  
  // Stats counter animation
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const increment = target / 100;
      let current = 0;
      
      const updateCounter = () => {
        if (current < target) {
          current += increment;
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };
      
      updateCounter();
    });
  }
  
  // Start counter animation when stats section is visible
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  initializeAnimations();
  
  // Close modals when clicking outside
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
  
  // Set default start date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('subscriptionStartDate').value = today;
});
