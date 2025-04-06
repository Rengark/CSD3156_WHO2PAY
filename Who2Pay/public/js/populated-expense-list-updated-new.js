// Render expenses and navbar when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initNavbar('Group 2', "SH3G91"); 
    ExpensesArrayModule.populateExpenses([
        { id: 254, name: "Expense 1", amount: 2000, date: "2025-04-05" },
        { id: 592, name: "Expense 2", amount: 1000, date: "2025-04-06" }
    ]);    
    renderExpenses();
});