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

        function exportToJSON() {
            if (expenses.length === 0) {
                alert('No expenses to export');
                return;
            }

            const jsonContent = JSON.stringify(expenses, null, 2);
            downloadFile(jsonContent, 'expenses.json', 'application/json');
        }

        function downloadFile(content, filename, contentType) {
            const blob = new Blob([content], { type: contentType });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }