
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



        function drawCharts() {
            drawPieChart();
            drawBarChart();
        }

        function drawPieChart() {
            const canvas = document.getElementById('pieChart');
            const ctx = canvas.getContext('2d');
            const categoryTotals = {};

            expenses.forEach(expense => {
                categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
            });

            const categories = Object.keys(categoryTotals);
            const amounts = Object.values(categoryTotals);
            const total = amounts.reduce((sum, amount) => sum + amount, 0);

            if (total === 0) {
                ctx.fillStyle = '#888';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
                return;
            }

            const colors = ['#00d4aa', '#00b894', '#008f7a', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8', '#f7dc6f'];
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = Math.min(centerX, centerY) - 80;

            let currentAngle = -Math.PI / 2;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            categories.forEach((category, index) => {
                const sliceAngle = (amounts[index] / total) * 2 * Math.PI;
                
                // Draw slice
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
                ctx.closePath();
                ctx.fillStyle = colors[index % colors.length];
                ctx.fill();
                ctx.strokeStyle = '#1a1a1a';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Draw labels on slices (only percentage)
                if (sliceAngle > 0.1) { // Only show percentage if slice is large enough
                    const labelAngle = currentAngle + sliceAngle / 2;
                    const labelRadius = radius * 0.7;
                    const labelX = centerX + Math.cos(labelAngle) * labelRadius;
                    const labelY = centerY + Math.sin(labelAngle) * labelRadius;
                    
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 12px Arial';
                    ctx.textAlign = 'center';
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 3;
                    
                    const percentage = ((amounts[index] / total) * 100).toFixed(1);
                    // Add text stroke for better visibility
                    ctx.strokeText(`${percentage}%`, labelX, labelY);
                    ctx.fillText(`${percentage}%`, labelX, labelY);
                }

                currentAngle += sliceAngle;
            });

            // Draw improved legend
            const legendX = 20;
            let legendY = 30;
            
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'left';
            ctx.fillText('Categories:', legendX, legendY);
            legendY += 25;

            categories.forEach((category, index) => {
                // Legend color box
                ctx.fillStyle = colors[index % colors.length];
                ctx.fillRect(legendX, legendY - 10, 15, 15);
                
                // Legend text
                ctx.fillStyle = '#fff';
                ctx.font = '12px Arial';
                ctx.textAlign = 'left';
                const legendText = `${category}: ${amounts[index].toFixed(2)}`;
                ctx.fillText(legendText, legendX + 25, legendY + 2);
                
                legendY += 20;
            });
        }

        function drawBarChart() {
            const canvas = document.getElementById('barChart');
            const ctx = canvas.getContext('2d');
            const monthlyTotals = {};

            // Group expenses by month
            expenses.forEach(expense => {
                const monthKey = expense.date.substring(0, 7); // YYYY-MM
                monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + expense.amount;
            });

            const months = Object.keys(monthlyTotals).sort();
            const amounts = months.map(month => monthlyTotals[month]);
            const maxAmount = Math.max(...amounts, 0);

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (months.length === 0) {
                ctx.fillStyle = '#888';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
                return;
            }

            const chartWidth = canvas.width - 80;
            const chartHeight = canvas.height - 80;
            const barWidth = chartWidth / months.length - 10;

            // Draw bars
            months.forEach((month, index) => {
                const barHeight = (amounts[index] / maxAmount) * chartHeight;
                const x = 60 + index * (barWidth + 10);
                const y = canvas.height - 40 - barHeight;

                // Bar
                const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
                gradient.addColorStop(0, '#00d4aa');
                gradient.addColorStop(1, '#00b894');
                ctx.fillStyle = gradient;
                ctx.fillRect(x, y, barWidth, barHeight);

                // Border
                ctx.strokeStyle = '#1a1a1a';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, barWidth, barHeight);

                // Month label
                ctx.fillStyle = '#fff';
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.save();
                ctx.translate(x + barWidth/2, canvas.height - 20);
                ctx.rotate(-Math.PI/4);
                ctx.fillText(month, 0, 0);
                ctx.restore();

                // Amount label
                ctx.fillStyle = '#fff';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`${amounts[index].toFixed(0)}`, x + barWidth/2, y - 5);
            });

            // Draw axes
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(50, 40);
            ctx.lineTo(50, canvas.height - 40);
            ctx.lineTo(canvas.width - 20, canvas.height - 40);
            ctx.stroke();

            // Y-axis labels
            for (let i = 0; i <= 5; i++) {
                const value = (maxAmount / 5) * i;
                const y = canvas.height - 40 - (i * chartHeight / 5);
                ctx.fillStyle = '#888';
                ctx.font = '10px Arial';
                ctx.textAlign = 'right';
                ctx.fillText(`${value.toFixed(0)}`, 45, y + 3);
            }
        }