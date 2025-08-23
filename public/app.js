function openCustomerModal() {
  document.getElementById('customerModal').classList.add('active');
}
async function openSubscriptionModal() {
  await ensureCustomersLoaded();
  populateCustomerDropdowns();
  document.getElementById('subscriptionModal').classList.add('active');
}
async function openInvoiceModal() {
  await ensureCustomersLoaded();
  await ensureSubscriptionsLoaded();
  populateCustomerDropdowns();
  populateSubscriptionDropdown();
  document.getElementById('invoiceModal').classList.add('active');
}
async function openPaymentModal() {
  await ensureCustomersLoaded();
  await ensureInvoicesLoaded();
  populateCustomerDropdowns();
  populateInvoiceDropdown();
  document.getElementById('paymentModal').classList.add('active');
}
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.textContent = message;
  document.getElementById('notifications').appendChild(notification);
  setTimeout(() => notification.remove(), 5000);
}


console.log('🚀 BILLZ App.js loaded - Full Dynamic Version 4.0');

const SUPABASE_URL = 'https://qqlshxvxeggabzybrbmr.supabase.co';

let currentUser = null;
let currentSection = 'overview';
let dashboardStats = {
  totalCustomers: 0,
  activeSubscriptions: 0,
  monthlyRevenue: 0,
  overdueAmount: 0
};

const appData = {
  customers: [],
  subscriptions: [],
  invoices: [],
  payments: []
};

function loadSupabase() {
  if (typeof supabase === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = () => console.log('✅ Supabase client loaded via CDN');
    document.head.appendChild(script);
  }
}

// API Helpers
const API_TOKEN_KEY = 'billz_token';
function getAuthToken() {
  return localStorage.getItem(API_TOKEN_KEY);
}
async function apiGet(path) {
  const token = getAuthToken();
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}
async function apiPost(path, body) {
  const token = getAuthToken();
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(body)
  });
  return res.json();
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

function showDashboard() {
  showPage('dashboardPage');
  showDashboardSection('overview');
}

function showDashboardSection(sectionId) {
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  document.querySelectorAll('.dashboard-section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  currentSection = sectionId;
  if (sectionId === 'overview') {
    loadDashboardStats();
    // Initialize dashboard charts if not already initialized
    if (!window.dashboardChartsInitialized) {
      initDashboardCharts();
      window.dashboardChartsInitialized = true;
    }
  }
  if (sectionId === 'customers') loadCustomersTable();
  if (sectionId === 'subscriptions') loadSubscriptionsTable();
  if (sectionId === 'invoices') loadInvoicesTable();
  if (sectionId === 'payments') loadPaymentsTable();
  if (sectionId === 'reports') {
    // Initialize report charts if not already initialized
    if (!window.reportChartsInitialized) {
      initReportCharts();
      window.reportChartsInitialized = true;
    }
  }
}

function showLogin() { document.getElementById('loginModal').classList.add('active'); }
function showSignup() { document.getElementById('signupModal').classList.add('active'); }
function switchToLogin() { closeModal('signupModal'); showLogin(); }
function switchToSignup() { closeModal('loginModal'); showSignup(); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function logout() { currentUser = null; showPage('landingPage'); showNotification('Logged out', 'info'); }

async function loadDashboardStats() {
  try {
    const result = await apiGet('/api/dashboard/stats');
    if (result.success) {
      dashboardStats = result.data;
      updateDashboardDisplay();
    } else {
      showNotification('Failed to load dashboard stats', 'error');
    }
  } catch {
    showNotification('Error loading dashboard stats', 'error');
  }
}

function updateDashboardDisplay() {
  const elems = {
    customers: document.querySelector('.metric-value[data-label="customers"]'),
    subs: document.querySelector('.metric-value[data-label="subscriptions"]'),
    rev: document.querySelector('.metric-value[data-label="revenue"]'),
    due: document.querySelector('.metric-value[data-label="overdue"]')
  };
  if (elems.customers) elems.customers.textContent = dashboardStats.totalCustomers;
  if (elems.subs) elems.subs.textContent = dashboardStats.activeSubscriptions;
  if (elems.rev) elems.rev.textContent = `$${dashboardStats.monthlyRevenue}`;
  if (elems.due) elems.due.textContent = `$${dashboardStats.overdueAmount}`;
}

// Data Loaders (use apiGet)
async function loadCustomersTable() {
  try {
    const result = await apiGet('/api/customers');
    const tbody = document.getElementById('customersTableBody');
    tbody.innerHTML = '';
    if (result.success) {
      appData.customers = result.data;
      result.data.forEach(c => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${c.name}</td>
          <td>${c.email}</td>
          <td>${c.company||'-'}</td>
          <td><span class="status-badge status-${c.status}">${c.status}</span></td>
          <td>$${c.total_revenue||0}</td>
          <td>
            <button onclick="deleteCustomer(${c.id})">Delete</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    }
  } catch {
    showNotification('Error loading customers','error');
  }
}

async function loadSubscriptionsTable() {
  try {
    const result = await apiGet('/api/subscriptions');
    const tbody = document.getElementById('subscriptionsTableBody');
    tbody.innerHTML = '';
    if (result.success) {
      appData.subscriptions = result.data;
      result.data.forEach(s => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${s.customer_name}</td>
          <td>${s.plan_name}</td>
          <td>$${s.plan_price}</td>
          <td>${s.billing_cycle}</td>
          <td><span class="status-badge status-${s.status}">${s.status}</span></td>
          <td>${s.next_billing_date||'-'}</td>
          <td>
            <button onclick="cancelSubscription(${s.id})">Cancel</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    }
    // Update subscription dropdown in invoice modal if it's open
    if (document.getElementById('invoiceModal').classList.contains('active')) {
      populateSubscriptionDropdown();
    }
  } catch {
    showNotification('Error loading subscriptions','error');
  }
}

async function loadInvoicesTable() {
  try {
    const result = await apiGet('/api/invoices');
    const tbody = document.getElementById('invoicesTableBody');
    tbody.innerHTML = '';
    if (result.success) {
      appData.invoices = result.data;
      result.data.forEach(i => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${i.invoice_number}</td>
          <td>${i.customer_name}</td>
          <td>$${i.total_amount}</td>
          <td>${i.due_date}</td>
          <td><span class="status-badge status-${i.status}">${i.status}</span></td>
          <td>
            ${i.status!=='paid'? `<button onclick="recordPayment(${i.id})">Pay</button>` : ''}
          </td>
        `;
        tbody.appendChild(row);
      });
    }
    // Update invoice dropdown in payment modal if it's open
    if (document.getElementById('paymentModal').classList.contains('active')) {
      populateInvoiceDropdown();
    }
  } catch {
    showNotification('Error loading invoices','error');
  }
}

async function loadPaymentsTable() {
  try {
    const result = await apiGet('/api/payments');
    const tbody = document.getElementById('paymentsTableBody');
    tbody.innerHTML = '';
    if (result.success) {
      appData.payments = result.data;
      result.data.forEach(p => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${p.customer_name}</td>
          <td>$${p.amount}</td>
          <td>${p.payment_method}</td>
          <td>${p.payment_date}</td>
          <td><span class="status-badge status-${p.status}">${p.status}</span></td>
          <td>${p.transaction_reference||'-'}</td>
        `;
        tbody.appendChild(row);
      });
    }
  } catch {
    showNotification('Error loading payments','error');
  }
}
// Function to populate customer dropdowns
function populateCustomerDropdowns() {
  const customerSelects = [
    document.getElementById('subscriptionCustomer'),
    document.getElementById('invoiceCustomer'),
    document.getElementById('paymentCustomer')
  ];
  
  // Clear existing options except the first one (Select Customer)
  customerSelects.forEach(select => {
    if (select) {
      // Keep the first option (Select Customer) and remove the rest
      while (select.options.length > 1) {
        select.remove(1);
      }
      
      // Add customer options
      appData.customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.textContent = customer.name + ' (' + customer.email + ')';
        select.appendChild(option);
      });
    }
  });
}

// Function to ensure customers are loaded before populating dropdowns
async function ensureCustomersLoaded() {
  if (appData.customers.length === 0) {
    try {
      const result = await apiGet('/api/customers');
      if (result.success) {
        appData.customers = result.data;
      }
    } catch (error) {
      console.error('Error loading customers:', error);
      showNotification('Error loading customers', 'error');
    }
  }
}

// Function to ensure subscriptions are loaded
async function ensureSubscriptionsLoaded() {
  if (appData.subscriptions.length === 0) {
    try {
      const result = await apiGet('/api/subscriptions');
      if (result.success) {
        appData.subscriptions = result.data;
      }
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      showNotification('Error loading subscriptions', 'error');
    }
  }
}

// Function to ensure invoices are loaded
async function ensureInvoicesLoaded() {
  if (appData.invoices.length === 0) {
    try {
      const result = await apiGet('/api/invoices');
      if (result.success) {
        appData.invoices = result.data;
      }
    } catch (error) {
      console.error('Error loading invoices:', error);
      showNotification('Error loading invoices', 'error');
    }
  }
}

// Function to fetch revenue data for charting
async function fetchRevenueData() {
  try {
    // For now, we'll use the existing dashboard stats endpoint
    // In a more advanced implementation, we might want a dedicated endpoint for historical data
    const result = await apiGet('/api/dashboard/stats');
    if (result.success) {
      return {
        currentRevenue: result.data.monthlyRevenue,
        overdueAmount: result.data.overdueAmount
      };
    }
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    showNotification('Error fetching revenue data', 'error');
  }
  return null;
}

// Function to fetch subscription status data for charting
async function fetchSubscriptionStatusData() {
  try {
    const result = await apiGet('/api/subscriptions');
    if (result.success) {
      const subscriptions = result.data;
      const statusCounts = {
        active: 0,
        trial: 0,
        cancelled: 0
      };
      
      subscriptions.forEach(sub => {
        if (sub.status === 'active') {
          statusCounts.active++;
        } else if (sub.status === 'trial') {
          statusCounts.trial++;
        } else if (sub.status === 'cancelled') {
          statusCounts.cancelled++;
        }
      });
      
      return statusCounts;
    }
  } catch (error) {
    console.error('Error fetching subscription status data:', error);
    showNotification('Error fetching subscription status data', 'error');
  }
  return null;
}

// Function to fetch customer growth data for charting
async function fetchCustomerGrowthData() {
  try {
    const result = await apiGet('/api/customers');
    if (result.success) {
      // For simplicity, we'll just return the total count
      // In a more advanced implementation, we might want historical data
      return result.data.length;
    }
  } catch (error) {
    console.error('Error fetching customer growth data:', error);
    showNotification('Error fetching customer growth data', 'error');
  }
  return null;
}

// Function to fetch overdue invoices data for charting
async function fetchOverdueInvoicesData() {
  try {
    const result = await apiGet('/api/invoices');
    if (result.success) {
      const overdueInvoices = result.data.filter(invoice => invoice.status === 'overdue');
      const overdueAmount = overdueInvoices.reduce((total, invoice) => total + (parseFloat(invoice.total_amount) || 0), 0);
      
      return {
        count: overdueInvoices.length,
        amount: overdueAmount
      };
    }
  } catch (error) {
    console.error('Error fetching overdue invoices data:', error);
    showNotification('Error fetching overdue invoices data', 'error');
  }
  return null;
}

// Function to populate subscription dropdown in invoice modal
function populateSubscriptionDropdown() {
  const subscriptionSelect = document.getElementById('invoiceSubscription');
  if (subscriptionSelect) {
    // Keep the first option (Select Subscription) and remove the rest
    while (subscriptionSelect.options.length > 1) {
      subscriptionSelect.remove(1);
    }
    
    // Add subscription options
    appData.subscriptions.forEach(subscription => {
      const option = document.createElement('option');
      option.value = subscription.id;
      option.textContent = subscription.plan_name + ' - ' + subscription.customer_name;
      subscriptionSelect.appendChild(option);
    });
  }
}

// Function to populate invoice dropdown in payment modal
function populateInvoiceDropdown() {
  const invoiceSelect = document.getElementById('paymentInvoice');
  if (invoiceSelect) {
    // Keep the first option (Select Invoice) and remove the rest
    while (invoiceSelect.options.length > 1) {
      invoiceSelect.remove(1);
    }
    
    // Add invoice options (only for unpaid invoices)
    appData.invoices.forEach(invoice => {
      if (invoice.status !== 'paid') {
        const option = document.createElement('option');
        option.value = invoice.id;
        option.textContent = invoice.invoice_number + ' - ' + invoice.customer_name + ' ($' + invoice.total_amount + ')';
        invoiceSelect.appendChild(option);
      }
    });
  }
}

// Initialize charts
let revenueChart = null;
let subscriptionChart = null;
let revenueReportChart = null;
let customerGrowthChart = null;

// Function to initialize dashboard charts
async function initDashboardCharts() {
  // Initialize revenue chart
  const revenueCtx = document.getElementById('revenueChart');
  if (revenueCtx) {
    const revenueData = await fetchRevenueData();
    if (revenueData) {
      revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
          labels: ['Current', 'Overdue'],
          datasets: [{
            label: 'Revenue ($)',
            data: [revenueData.currentRevenue, revenueData.overdueAmount],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Revenue Overview'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value;
                }
              }
            }
          }
        }
      });
    }
  }

  // Initialize subscription status chart
  const subscriptionCtx = document.getElementById('subscriptionChart');
  if (subscriptionCtx) {
    const subscriptionData = await fetchSubscriptionStatusData();
    if (subscriptionData) {
      subscriptionChart = new Chart(subscriptionCtx, {
        type: 'doughnut',
        data: {
          labels: ['Active', 'Trial', 'Cancelled'],
          datasets: [{
            data: [subscriptionData.active, subscriptionData.trial, subscriptionData.cancelled],
            backgroundColor: [
              'rgba(75, 192, 192, 0.8)',
              'rgba(255, 205, 86, 0.8)',
              'rgba(255, 99, 132, 0.8)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            },
            title: {
              display: true,
              text: 'Subscription Status'
            }
          }
        }
      });
    }
  }
}

// Function to initialize report charts
async function initReportCharts() {
  // Initialize revenue report chart
  const revenueReportCtx = document.getElementById('revenueReportChart');
  if (revenueReportCtx) {
    const revenueData = await fetchRevenueData();
    if (revenueData) {
      revenueReportChart = new Chart(revenueReportCtx, {
        type: 'bar',
        data: {
          labels: ['Monthly Revenue', 'Overdue Amount'],
          datasets: [{
            label: 'Amount ($)',
            data: [revenueData.currentRevenue, revenueData.overdueAmount],
            backgroundColor: [
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 99, 132, 0.8)'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Revenue Analytics'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value;
                }
              }
            }
          }
        }
      });
    }
  }

  // Initialize customer growth chart
  const customerGrowthCtx = document.getElementById('customerGrowthChart');
  if (customerGrowthCtx) {
    const customerCount = await fetchCustomerGrowthData();
    if (customerCount !== null) {
      customerGrowthChart = new Chart(customerGrowthCtx, {
        type: 'bar',
        data: {
          labels: ['Total Customers'],
          datasets: [{
            label: 'Customers',
            data: [customerCount],
            backgroundColor: 'rgba(153, 102, 255, 0.8)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Customer Base'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0
              }
            }
          }
        }
      });
    }
  }

  // Update overdue invoices list
  const overdueInvoicesList = document.getElementById('overdueInvoicesList');
  if (overdueInvoicesList) {
    const overdueData = await fetchOverdueInvoicesData();
    if (overdueData) {
      overdueInvoicesList.innerHTML = `
        <div class="metric-card">
          <div class="metric-content">
            <div class="metric-value">${overdueData.count}</div>
            <div class="metric-label">Overdue Invoices</div>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-content">
            <div class="metric-value">$${overdueData.amount.toFixed(2)}</div>
            <div class="metric-label">Overdue Amount</div>
          </div>
        </div>
      `;
    }
  }
}

// Form submissions now use apiPost
document.addEventListener('DOMContentLoaded', () => {
  loadSupabase();
  document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const data = await apiPost('/api/auth/login', { email, password });
    if (data.success) {
      localStorage.setItem(API_TOKEN_KEY, data.token);
      currentUser = data.user;
      closeModal('loginModal');
      showDashboard();
      showNotification('Login successful','success');
    } else {
      showNotification(data.error||'Login failed','error');
    }
  });

  document.getElementById('signupForm').addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const company = document.getElementById('signupCompany').value;
    const password = document.getElementById('signupPassword').value;
    const data = await apiPost('/api/auth/register', { name, email, company, password });
    if (data.success) {
      if (data.token) localStorage.setItem(API_TOKEN_KEY, data.token);
      currentUser = data.user;
      closeModal('signupModal');
      showDashboard();
      showNotification('Account created','success');
    } else {
      showNotification(data.error||'Registration failed','error');
    }
  });

  document.getElementById('customerForm').addEventListener('submit', async e => {
    e.preventDefault();
    const body = {
      name: document.getElementById('customerName').value,
      email: document.getElementById('customerEmail').value,
      company: document.getElementById('customerCompany').value,
      address_street: document.getElementById('customerStreet').value,
      address_city: document.getElementById('customerCity').value,
      address_state: document.getElementById('customerState').value,
      address_zip: document.getElementById('customerZip').value
    };
    const result = await apiPost('/api/customers', body);
    if (result.success) {
      closeModal('customerModal');
      loadCustomersTable();
      loadDashboardStats();
      showNotification('Customer saved','success');
    } else {
      showNotification(result.error||'Failed','error');
    }
  });

  document.getElementById('subscriptionForm').addEventListener('submit', async e => {
    e.preventDefault();
    const body = {
      customer_id: parseInt(document.getElementById('subscriptionCustomer').value),
      plan_name: document.getElementById('subscriptionPlan').value,
      plan_price: parseFloat(document.getElementById('subscriptionAmount').value),
      billing_cycle: document.getElementById('subscriptionCycle').value,
      status: document.getElementById('subscriptionTrial').checked?'trial':'active',
      start_date: document.getElementById('subscriptionStartDate').value,
      trial_start: document.getElementById('subscriptionTrial').checked?document.getElementById('trialStart').value:null,
      trial_end: document.getElementById('subscriptionTrial').checked?document.getElementById('trialEnd').value:null
    };
    const result = await apiPost('/api/subscriptions', body);
    if (result.success) {
      closeModal('subscriptionModal');
      loadSubscriptionsTable();
      loadDashboardStats();
      showNotification('Subscription created','success');
    } else {
      showNotification(result.error||'Failed','error');
    }
  });

  document.getElementById('invoiceForm').addEventListener('submit', async e => {
    e.preventDefault();
    const body = {
      customer_id: parseInt(document.getElementById('invoiceCustomer').value),
      subscription_id: parseInt(document.getElementById('invoiceSubscription').value)||null,
      amount: parseFloat(document.getElementById('invoiceAmount').value),
      description: document.getElementById('invoiceDescription').value,
      due_date: document.getElementById('invoiceDueDate').value
    };
    const result = await apiPost('/api/invoices', body);
    if (result.success) {
      closeModal('invoiceModal');
      loadInvoicesTable();
      loadDashboardStats();
      showNotification('Invoice created','success');
    } else {
      showNotification(result.error||'Failed','error');
    }
  });

  document.getElementById('paymentForm').addEventListener('submit', async e => {
    e.preventDefault();
    const body = {
      customer_id: parseInt(document.getElementById('paymentCustomer').value),
      invoice_id: parseInt(document.getElementById('paymentInvoice').value)||null,
      amount: parseFloat(document.getElementById('paymentAmount').value),
      payment_method: document.getElementById('paymentMethod').value,
      payment_date: document.getElementById('paymentDate').value,
      notes: document.getElementById('paymentNotes').value
    };
    const result = await apiPost('/api/payments', body);
    if (result.success) {
      closeModal('paymentModal');
      loadPaymentsTable();
      loadInvoicesTable();
      loadDashboardStats();
      showNotification('Payment recorded','success');
    } else {
      showNotification(result.error||'Failed','error');
    }
  });

  console.log('✅ BILLZ Application initialized - Full Dynamic Version!');
});
