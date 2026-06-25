// static/script.js - Complete with Charts, PKR Support, Export & Notifications

// Currency configuration
const CURRENCY = {
    PKR: { symbol: 'Rs.', rate: 1 },
    USD: { symbol: '$', rate: 0.0036 }
};

let currentCurrency = 'PKR';
let categoryChart = null;
let trendChart = null;

// ============================================
// DOM READY - Initialize on page load
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    console.log('✅ Expense Tracker initialized');
    
    // Show today's date
    const today = new Date();
    const dateElement = document.getElementById('todayDate');
    if (dateElement) {
        dateElement.textContent = today.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
    
    // Check for saved currency preference
    const savedCurrency = localStorage.getItem('preferredCurrency');
    if (savedCurrency) {
        currentCurrency = savedCurrency;
    }
    
    // Load expenses
    loadExpenses();
    
    // Category filter event
    const filterSelect = document.getElementById('categoryFilter');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            loadExpenses(this.value);
        });
    }
    
    // Currency selector event
    const currencyRadios = document.querySelectorAll('input[name="currency"]');
    if (currencyRadios.length > 0) {
        currencyRadios.forEach(radio => {
            if (radio.value === currentCurrency) {
                radio.checked = true;
            }
            radio.addEventListener('change', function() {
                currentCurrency = this.value;
                localStorage.setItem('preferredCurrency', currentCurrency);
                const filter = document.getElementById('categoryFilter');
                loadExpenses(filter ? filter.value : 'all');
            });
        });
    }
    
    // Add Export button
    addExportButton();
});

// ============================================
// FORMAT CURRENCY
// ============================================
function formatCurrency(amount) {
    const currency = CURRENCY[currentCurrency];
    const convertedAmount = amount * currency.rate;
    return `${currency.symbol} ${convertedAmount.toFixed(2)}`;
}

// ============================================
// CHARTS FUNCTION
// ============================================
function initCharts(expenses) {
    console.log('📊 Initializing charts with', expenses ? expenses.length : 0, 'expenses');
    
    // Destroy existing charts
    if (categoryChart) {
        categoryChart.destroy();
        categoryChart = null;
    }
    if (trendChart) {
        trendChart.destroy();
        trendChart = null;
    }
    
    // Get canvas elements
    const ctx1 = document.getElementById('categoryChart');
    const ctx2 = document.getElementById('trendChart');
    
    if (!ctx1 || !ctx2) {
        console.warn('⚠️ Chart canvases not found');
        return;
    }
    
    // If no expenses, show empty state
    if (!expenses || expenses.length === 0) {
        console.log('📊 No expenses to display in charts');
        // Clear canvases
        ctx1.getContext('2d').clearRect(0, 0, ctx1.width, ctx1.height);
        ctx2.getContext('2d').clearRect(0, 0, ctx2.width, ctx2.height);
        return;
    }
    
    try {
        // 1. PIE CHART - Spending by Category
        const categoryData = {};
        expenses.forEach(exp => {
            categoryData[exp.category] = (categoryData[exp.category] || 0) + exp.amount;
        });
        
        const categories = Object.keys(categoryData);
        const amounts = Object.values(categoryData);
        const colors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];
        
        categoryChart = new Chart(ctx1, {
            type: 'pie',
            data: {
                labels: categories,
                datasets: [{
                    data: amounts,
                    backgroundColor: colors.slice(0, categories.length),
                    borderWidth: 2,
                    borderColor: '#FFFFFF'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: { size: 11 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${formatCurrency(context.parsed)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
        console.log('✅ Pie chart created');
        
        // 2. BAR CHART - Monthly Trend
        const monthlyData = {};
        expenses.forEach(exp => {
            const date = new Date(exp.date);
            const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            monthlyData[monthYear] = (monthlyData[monthYear] || 0) + exp.amount;
        });
        
        const months = Object.keys(monthlyData);
        const monthlyTotals = Object.values(monthlyData);
        
        trendChart = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Monthly Spending',
                    data: monthlyTotals,
                    backgroundColor: '#2563EB',
                    borderColor: '#1D4ED8',
                    borderWidth: 2,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Total: ${formatCurrency(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: '#F1F5F9' },
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value);
                            }
                        }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
        console.log('✅ Bar chart created');
        
    } catch (error) {
        console.error('❌ Error creating charts:', error);
    }
}

// ============================================
// LOAD EXPENSES
// ============================================
function loadExpenses(category = 'all') {
    console.log('🔄 Loading expenses...');
    const url = category === 'all' ? '/api/expenses' : `/api/expenses?category=${encodeURIComponent(category)}`;
    
    // Show loading state
    const tbody = document.getElementById('expenseTableBody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem; color: #94A3B8;">
                    <i class="fas fa-spinner fa-spin"></i> Loading...
                </td>
            </tr>
        `;
    }
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('✅ Data loaded:', data.count, 'expenses');
            
            // Update statistics
            const totalAmount = document.getElementById('totalAmount');
            const totalCount = document.getElementById('totalCount');
            const categoryCount = document.getElementById('categoryCount');
            
            if (totalAmount) totalAmount.textContent = formatCurrency(data.total);
            if (totalCount) totalCount.textContent = data.count;
            
            const categories = new Set(data.expenses.map(e => e.category));
            if (categoryCount) categoryCount.textContent = categories.size;
            
            // Build table
            const tbody = document.getElementById('expenseTableBody');
            const emptyState = document.getElementById('emptyState');
            
            if (data.expenses.length === 0) {
                if (tbody) tbody.innerHTML = '';
                if (emptyState) emptyState.style.display = 'block';
                document.getElementById('categorySummary').textContent = 'No expenses';
                initCharts([]);
                return;
            }
            if (emptyState) emptyState.style.display = 'none';
            
            let html = '';
            data.expenses.forEach(exp => {
                const date = new Date(exp.date);
                const formattedDate = date.toLocaleDateString('en-US', { 
                    year: 'numeric', month: 'short', day: 'numeric' 
                });
                
                const emojiMap = {
                    'Food': '🍔', 'Transport': '🚗', 
                    'Shopping': '🛍️', 'Bills': '📄', 'Other': '📌'
                };
                const emoji = emojiMap[exp.category] || '📌';
                
                html += `
                    <tr>
                        <td><strong>${escapeHtml(exp.description)}</strong></td>
                        <td><span class="category-badge">${emoji} ${escapeHtml(exp.category)}</span></td>
                        <td class="amount-col">${formatCurrency(exp.amount)}</td>
                        <td>${formattedDate}</td>
                        <td class="actions-col">
                            <button class="delete-btn" data-id="${exp.id}" title="Delete expense">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
            if (tbody) tbody.innerHTML = html;
            
            // Category summary
            const catCounts = {};
            data.expenses.forEach(e => {
                catCounts[e.category] = (catCounts[e.category] || 0) + 1;
            });
            const summary = Object.entries(catCounts).map(([cat, cnt]) => `${cat} (${cnt})`);
            document.getElementById('categorySummary').textContent = summary.join(' • ');
            
            // Initialize charts
            initCharts(data.expenses);
            
            // Delete buttons
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    deleteExpense(this.getAttribute('data-id'));
                });
            });
        })
        .catch(err => {
            console.error('❌ Error loading expenses:', err);
            document.getElementById('categorySummary').textContent = 'Error loading data';
            const tbody = document.getElementById('expenseTableBody');
            if (tbody) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 2rem; color: #EF4444;">
                            <i class="fas fa-exclamation-circle"></i> Error loading expenses. Please refresh.
                        </td>
                    </tr>
                `;
            }
        });
}

// ============================================
// DELETE EXPENSE
// ============================================
function deleteExpense(id) {
    if (!confirm('Delete this expense?')) return;
    
    fetch(`/api/expenses/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const filter = document.getElementById('categoryFilter');
                loadExpenses(filter ? filter.value : 'all');
                showToast('✅ Expense deleted successfully!', 'success');
            }
        })
        .catch(err => {
            console.error('Error:', err);
            showToast('❌ Error deleting expense', 'error');
        });
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 14px 24px;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#10B981' : '#EF4444'};
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-family: 'Inter', sans-serif;
        max-width: 350px;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// ESCAPE HTML
// ============================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// EXPORT TO CSV
// ============================================
function exportToCSV() {
    const filter = document.getElementById('categoryFilter');
    const url = filter && filter.value !== 'all' 
        ? `/api/expenses?category=${encodeURIComponent(filter.value)}`
        : '/api/expenses';
    
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.expenses.length === 0) {
                showToast('No expenses to export!', 'error');
                return;
            }
            
            let csv = 'Description,Category,Amount,Date\n';
            data.expenses.forEach(exp => {
                csv += `"${exp.description}","${exp.category}",${exp.amount},"${exp.date}"\n`;
            });
            
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
            
            showToast('✅ CSV exported successfully!', 'success');
        })
        .catch(err => {
            console.error('Error:', err);
            showToast('❌ Error exporting CSV', 'error');
        });
}

// ============================================
// ADD EXPORT BUTTON
// ============================================
function addExportButton() {
    const filterBar = document.querySelector('.filter-bar');
    if (!filterBar) return;
    
    // Check if button already exists
    if (filterBar.querySelector('.btn-export')) return;
    
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn-export';
    exportBtn.innerHTML = '<i class="fas fa-file-export"></i> Export CSV';
    exportBtn.style.cssText = `
        background: #10B981;
        color: white;
        border: none;
        padding: 0.45rem 1.2rem;
        border-radius: 40px;
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        transition: 0.2s;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: 'Inter', sans-serif;
    `;
    exportBtn.addEventListener('mouseenter', function() {
        this.style.background = '#059669';
    });
    exportBtn.addEventListener('mouseleave', function() {
        this.style.background = '#10B981';
    });
    exportBtn.addEventListener('click', exportToCSV);
    filterBar.appendChild(exportBtn);
    console.log('✅ Export button added');
}

// ============================================
// ADD CSS ANIMATIONS
// ============================================
const styleElement = document.createElement('style');
styleElement.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .amount-col {
        font-weight: 600;
        color: #0F172A;
    }
    .delete-btn {
        background: none;
        border: none;
        color: #94A3B8;
        font-size: 1.1rem;
        cursor: pointer;
        padding: 0.2rem 0.5rem;
        border-radius: 8px;
        transition: 0.2s;
    }
    .delete-btn:hover {
        color: #EF4444;
        background: #FEF2F2;
    }
    #categoryChart, #trendChart {
        display: block !important;
        max-width: 100%;
        min-height: 200px;
    }
    @media (max-width: 640px) {
        div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
        }
        #categoryChart, #trendChart {
            min-height: 150px;
        }
        .btn-export {
            font-size: 0.75rem !important;
            padding: 0.3rem 0.8rem !important;
        }
    }
`;
document.head.appendChild(styleElement);

console.log('✅ Expense Tracker Pro loaded successfully!');
