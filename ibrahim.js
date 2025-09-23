
        function getCategoryIcon(category) {
            const icons = {
                'Food': '🍕',
                'Transport': '🚗',
                'Shopping': '🛍️',
                'Entertainment': '🎬',
                'Bills': '📋',
                'Healthcare': '🏥',
                'Education': '📚',
                'Other': '📦'
            };
            return icons[category] || '📦';
        }

        function formatDate(dateString) {
            return new Date(dateString).toLocaleDateString();
        }

        function filterExpenses() {
            const categoryFilter = document.getElementById('filterCategory').value;
            const dateFromFilter = document.getElementById('filterDateFrom').value;
            const dateToFilter = document.getElementById('filterDateTo').value;
            const searchFilter = document.getElementById('searchExpense').value.toLowerCase();

            let filteredExpenses = expenses.filter(expense => {
                // Category filter
                if (categoryFilter && expense.category !== categoryFilter) {
                    return false;
                }

                // Date range filter
                const expenseDate = new Date(expense.date);
                if (dateFromFilter && expenseDate < new Date(dateFromFilter)) {
                    return false;
                }
                if (dateToFilter && expenseDate > new Date(dateToFilter)) {
                    return false;
                }

                // Search filter
                if (searchFilter && !expense.description.toLowerCase().includes(searchFilter) && 
                    !expense.category.toLowerCase().includes(searchFilter)) {
                    return false;
                }

                return true;
            });

            displayExpenses(filteredExpenses);
        }

        function updateQuickStats() {
            const quickStats = document.getElementById('quickStats');
            const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
            const todayExpenses = expenses
                .filter(expense => expense.date === new Date().toISOString().split('T')[0])
                .reduce((sum, expense) => sum + expense.amount, 0);
            const thisMonthExpenses = expenses
                .filter(expense => {
                    const expenseDate = new Date(expense.date);
                    const currentDate = new Date();
                    return expenseDate.getMonth() === currentDate.getMonth() && 
                           expenseDate.getFullYear() === currentDate.getFullYear();
                })
                .reduce((sum, expense) => sum + expense.amount, 0);

            quickStats.innerHTML = `
                <div class="stat-card">
                    <div class="stat-value">${totalExpenses.toFixed(2)}</div>
                    <div>Total Expenses</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${todayExpenses.toFixed(2)}</div>
                    <div>Today's Expenses</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${thisMonthExpenses.toFixed(2)}</div>
                    <div>This Month</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${expenses.length}</div>
                    <div>Total Entries</div>
                </div>
            `;
        }
                function updateReports() {
            const reportStats = document.getElementById('reportStats');
            const categoryTotals = {};
            const monthlyTotals = {};

            expenses.forEach(expense => {
                // Category totals
                categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
                
                // Monthly totals
                const monthKey = expense.date.substring(0, 7); // YYYY-MM
                monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + expense.amount;
            });

            const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
            const averageExpense = totalAmount / (expenses.length || 1);
            const highestCategory = Object.keys(categoryTotals).reduce((a, b) => 
                categoryTotals[a] > categoryTotals[b] ? a : b, '');

            reportStats.innerHTML = `
                <div class="stat-card">
                    <div class="stat-value">${totalAmount.toFixed(2)}</div>
                    <div>Total Spent</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${averageExpense.toFixed(2)}</div>
                    <div>Average Expense</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${getCategoryIcon(highestCategory)} ${highestCategory}</div>
                    <div>Top Category</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${Object.keys(categoryTotals).length}</div>
                    <div>Categories Used</div>
                </div>
            `;

            // Category breakdown
            const categoryBreakdown = document.getElementById('categoryBreakdown');
            const sortedCategories = Object.entries(categoryTotals)
                .sort((a, b) => b[1] - a[1]);

            categoryBreakdown.innerHTML = sortedCategories
                .map(([category, amount]) => {
                    const percentage = ((amount / totalAmount) * 100).toFixed(1);
                    return `
                        <div style="display: flex; justify-content: space-between; align-items: center; 
                                    padding: 15px; margin-bottom: 10px; background: rgba(0,212,170,0.1); 
                                    border-radius: 10px;">
                            <div>
                                <span style="font-size: 1.2em;">${getCategoryIcon(category)}</span>
                                <strong style="margin-left: 10px;">${category}</strong>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 1.2em; font-weight: bold; color: #00d4aa;">
                                    ${amount.toFixed(2)}
                                </div>
                                <div style="color: #888; font-size: 0.9em;">${percentage}% of total</div>
                            </div>
                        </div>
                    `;
                }).join('');
        }


