
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