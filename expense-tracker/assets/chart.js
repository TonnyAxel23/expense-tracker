let categoryChartInstance = null;
let monthlyChartInstance = null;

function renderCategoryChart(expenses, allCategories) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    // Calculate totals by category
    const categoryTotals = {};
    allCategories.forEach(cat => categoryTotals[cat] = 0);
    
    expenses.forEach(exp => {
        categoryTotals[exp.category] += exp.amount;
    });
    
    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);
    
    // Colors for categories
    const backgroundColors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)'
    ];
    
    // Destroy previous chart if exists
    if (categoryChartInstance) {
        categoryChartInstance.destroy();
    }
    
    categoryChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: backgroundColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Expenses by Category',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function renderMonthlyChart(expenses) {
    const ctx = document.getElementById('monthlyChart').getContext('2d');
    
    // Group expenses by month
    const monthlyTotals = {};
    
    expenses.forEach(exp => {
        const [year, month] = exp.date.split('-');
        const monthYear = `${year}-${month}`;
        const monthName = new Date(exp.date).toLocaleString('default', { month: 'short' });
        
        if (!monthlyTotals[monthYear]) {
            monthlyTotals[monthYear] = {
                name: `${monthName} ${year}`,
                total: 0
            };
        }
        
        monthlyTotals[monthYear].total += exp.amount;
    });
    
    // Sort by date
    const sortedMonths = Object.keys(monthlyTotals).sort();
    const labels = sortedMonths.map(month => monthlyTotals[month].name);
    const data = sortedMonths.map(month => monthlyTotals[month].total);
    
    // Destroy previous chart if exists
    if (monthlyChartInstance) {
        monthlyChartInstance.destroy();
    }
    
    monthlyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Monthly Expenses',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Monthly Expenses',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Total: $${context.raw.toFixed(2)}`;
                        }
                    }
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