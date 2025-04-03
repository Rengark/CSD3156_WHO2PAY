// ---------- NAVBAR ---------- //

// This function initializes the navbar with the group name
function initNavbar(groupName) {
    // Set the group name in the navbar
    document.getElementById('groupNamePlaceholder').textContent = groupName;
    
    // Add click event listener to the copy button
    document.getElementById('copyBtn').addEventListener('click', function() {
        const sessionCode = document.getElementById('sessionCode').textContent;
        copyToClipboard(sessionCode);
    });
    
    // Add click event listener to the logout button
    document.getElementById('logoutBtn').addEventListener('click', function() {
        // Handle logout functionality here
        console.log('Logging out...');
    });
}


// ---------- EXPENSE LIST ---------- //

// sample
const ExpensesArrayModule = (() => {
    let expensesArray = [
        { id: 69, name: "Expense 1", amount: 20.00, date: "2025-03-01" },
        { id: 420, name: "Expense 2", amount: 10.50, date: "2025-02-08" },
        { id: 333, name: "Expense 3", amount: 9.99, date: "2025-04-01" },
        { id: 123, name: "Expense 4", amount: 88.8, date: "2025-05-06" },
        { id: 23, name: "Expense 5", amount: 33.3, date: "2025-03-29" },
        { id: 14, name: "Expense 6", amount: 0.40, date: "2025-02-28" },
        { id: 72, name: "Expense 7", amount: 5.00, date: "2025-03-28" },
        { id: 68, name: "Expense 8", amount: 27.50, date: "2025-01-28" }
    ];

    let htmlMappedExpenses = [];

    return {
        addExpenses: (item) => expensesArray.push(item),
        getExpenses: () => [...expensesArray], // Return a copy to prevent direct modification
        addHtmlMapping: (item) => htmlMappedExpenses.push(item),
        getHtmlMapping: () => [...htmlMappedExpenses] // Return a copy to prevent direct modification
    };
})();
// @TODO - Make sure to limit the amount of entries retrieved at a time. Maybe introduce pagination?

// Function to group expenses by date
function groupExpensesByDate(expenses) {
    const groupedExpenses = {};
    
    expenses.forEach(expense => {
        if (!groupedExpenses[expense.date]) {
            groupedExpenses[expense.date] = [];
        }
        groupedExpenses[expense.date].push(expense);
    });
    
    // Sort dates in descending order (newest first)
    return Object.keys(groupedExpenses)
        .sort((a, b) => new Date(b) - new Date(a))
        .map(date => ({
            date,
            formattedDate: formatDate(date),
            expenses: groupedExpenses[date]
        }));
}

// Function to render expenses
function renderExpenses() {
    const container = document.getElementById('expensesContainer');
    const groupedExpenses = groupExpensesByDate(ExpensesArrayModule.getExpenses());
    
    let html = '';
    
    groupedExpenses.forEach(group => {
        html += `<div class="date-header">${group.formattedDate}</div>`;
        
        group.expenses.forEach(expense => {
            // Create a unique identifier for this expense element
            const expenseElementId = `expense-${expense.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            html += `
                <div class="expense-item" id="${expenseElementId}">
                    <div class="expense-name">${expense.name}</div>
                    <div class="expense-right">
                        <div class="expense-amount">$${expense.amount.toFixed(2)}</div>
                        <div class="expense-options">...</div>
                    </div>
                </div>
            `;
            
            // Store the relationship between element ID and expense ID
            ExpensesArrayModule.addHtmlMapping({
                elementId: expenseElementId,
                expenseId: expense.id
            });
        });
    });
    
    // Set the HTML content
    container.innerHTML = html;
    
    // Now add event listeners to each expense item
    ExpensesArrayModule.getHtmlMapping().forEach(item => {
        const element = document.getElementById(item.elementId);
        if (element) {
            element.addEventListener('click', function() {
                editExpense(item.expenseId);
            });
        }
    });
}

// Function to handle expense edit
function editExpense(expenseId) {
    // Navigate to edit page using the expense ID
    console.log(`Navigating to edit page for expense ID: ${expenseId}`);
}

// Add event listeners to the top buttons
document.getElementById('addExpenseBtn').addEventListener('click', function() {
    console.log('Add Expense button clicked');
    // Add your logic to handle adding a new expense
});

document.getElementById('settleUpBtn').addEventListener('click', function() {
    console.log('Settle Up button clicked');
    // Add your logic to handle settling up
});

// Render expenses and navbar when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initNavbar('Group Name'); // @TODO - Replace with group name
    renderExpenses();
});