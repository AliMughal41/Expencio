function exportToCSV() {
            if (expenses.length === 0) {
                alert('No expenses to export');
                return;
            }

            const csvContent = [
                ['Date', 'Category', 'Description', 'Amount'],
                ...expenses.map(expense => [
                    expense.date,
                    expense.category,
                    expense.description,
                    expense.amount
                ])
            ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

            downloadFile(csvContent, 'expenses.csv', 'text/csv');
        }