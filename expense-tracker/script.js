// Expense Tracker Application
class ExpenseTracker {
    constructor() {
        this.expenses = [];
        this.categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Other'];
        this.currentId = 1;
        
        // Initialize the app
        this.init();
    }
    
    init() {
        // Load expenses from localStorage
        this.loadExpenses();
        
        // Set up event listeners
        document.getElementById('expenseForm').addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Initialize filters
        this.initFilters();
        
        // Render initial data
        this.renderExpenses();
        this.renderCharts();
    }
    
    loadExpenses() {
        const savedExpenses = localStorage.getItem('expenses');
        if (savedExpenses) {
            this.expenses = JSON.parse(savedExpenses);
            if (this.expenses.length > 0) {
                this.currentId = Math.max(...this.expenses.map(exp => exp.id)) + 1;
            }
        }
    }
    
    saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(this.expenses));
    }
    
    handleFormSubmit(e) {
        e.preventDefault();
        
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;
        const note = document.getElementById('note').value;
        
        if (!amount || !category || !date) {
            alert('Please fill in all required fields');
            return;
        }
        
        const newExpense = {
            id: this.currentId++,
            amount,
            category,
            date,
            note
        };
        
        this.expenses.push(newExpense);
        this.saveExpenses();
        
        // Reset form
        e.target.reset();
        
        // Update UI
        this.renderExpenses();
        this.renderCharts();
        this.updateFilterOptions();
    }
    
    editExpense(id) {
        const expense = this.expenses.find(exp => exp.id === id);
        if (!expense) return;
        
        document.getElementById('amount').value = expense.amount;
        document.getElementById('category').value = expense.category;
        document.getElementById('date').value = expense.date;
        document.getElementById('note').value = expense.note || '';
        
        // Remove the expense (will be re-added on submit)
        this.expenses = this.expenses.filter(exp => exp.id !== id);
        this.saveExpenses();
    }
    
    deleteExpense(id) {
        if (confirm('Are you sure you want to delete this expense?')) {
            this.expenses = this.expenses.filter(exp => exp.id !== id);
            this.saveExpenses();
            this.renderExpenses();
            this.renderCharts();
            this.updateFilterOptions();
        }
    }
    
    initFilters() {
        // Populate category filter
        const categoryFilter = document.getElementById('filterCategory');
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
        
        // Set up event listeners for filters
        document.getElementById('filterCategory').addEventListener('change', () => this.renderExpenses());
        document.getElementById('filterMonth').addEventListener('change', () => this.renderExpenses());
        document.getElementById('filterYear').addEventListener('change', () => this.renderExpenses());
        
        // Initialize month and year filters
        this.updateFilterOptions();
    }
    
    updateFilterOptions() {
        // Get unique years and months from expenses
        const years = [...new Set(this.expenses.map(exp => exp.date.split('-')[0]))];
        const months = [...new Set(this.expenses.map(exp => exp.date.split('-')[1]))];
        
        // Update year filter
        const yearFilter = document.getElementById('filterYear');
        yearFilter.innerHTML = '<option value="">All Years</option>';
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });
        
        // Update month filter
        const monthFilter = document.getElementById('filterMonth');
        monthFilter.innerHTML = '<option value="">All Months</option>';
        months.forEach(month => {
            const option = document.createElement('option');
            option.value = month;
            option.textContent = new Date(2000, parseInt(month) - 1, 1).toLocaleString('default', { month: 'long' });
            monthFilter.appendChild(option);
        });
    }
    
    getFilteredExpenses() {
        const categoryFilter = document.getElementById('filterCategory').value;
        const monthFilter = document.getElementById('filterMonth').value;
        const yearFilter = document.getElementById('filterYear').value;
        
        return this.expenses.filter(expense => {
            const [year, month] = expense.date.split('-');
            
            return (!categoryFilter || expense.category === categoryFilter) &&
                   (!monthFilter || month === monthFilter) &&
                   (!yearFilter || year === yearFilter);
        });
    }
    
    renderExpenses() {
        const filteredExpenses = this.getFilteredExpenses();
        const tableBody = document.querySelector('#expensesTable tbody');
        tableBody.innerHTML = '';
        
        let total = 0;
        
        filteredExpenses.forEach(expense => {
            total += expense.amount;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(expense.date).toLocaleDateString()}</td>
                <td>${expense.category}</td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td>${expense.note || ''}</td>
                <td class="actions">
                    <button class="edit-btn" data-id="${expense.id}">Edit</button>
                    <button class="delete-btn" data-id="${expense.id}">Delete</button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Update total
        document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
        
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => this.editExpense(parseInt(btn.dataset.id)));
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => this.deleteExpense(parseInt(btn.dataset.id)));
        });
    }
    
    renderCharts() {
        const filteredExpenses = this.getFilteredExpenses();
        renderCategoryChart(filteredExpenses, this.categories);
        renderMonthlyChart(filteredExpenses);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const tracker = new ExpenseTracker();
});

// Helper function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}