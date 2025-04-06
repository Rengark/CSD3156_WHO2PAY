let groupId = null;
let authToken = null;
let password_enforced = null;

// ---------- NAVBAR ---------- //

// This function initializes the navbar with the group name
function initNavbar(groupName, groupCode) {
    // Set the group name in the navbar
    document.getElementById('groupNamePlaceholder').textContent = groupName;
    document.getElementById('sessionCode').textContent = groupCode;
    
    // Add click event listener to the copy button
    document.getElementById('copyBtn').addEventListener('click', function() {
        const sessionCode = document.getElementById('sessionCode').textContent;
        copyToClipboard(sessionCode);
    });
    
    // Add click event listener to the logout button
    document.getElementById('logout').addEventListener('click', function() {
        // Handle logout functionality here
        console.log('Logging out...');
    });
}


// ---------- EXPENSE LIST ---------- //

// sample
const ExpensesArrayModule = (() => {
    let expensesArray = [];

    let htmlMappedExpenses = [];

    return {
        populateExpenses: (arr) => { 
            // @TODO Brandon - populate the expensesArray with expenses formatted as
            // { id: int, expenseName: String, amount: int, date: date in YYYY-MM-DD format}

            expensesArray = arr;
        },
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

    // Check if the expense list is empty
    if(ExpensesArrayModule.getExpenses().length === 0)
    {
        container.innerHTML += `<div id="no-expenses-msg" class="info-text">All settled up.</div>`;
        return;
    }

    // Expense list is not empty, populate it with entries
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
                        <div class="expense-amount">$${formatAmount(expense.amount)}</div>
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
document.getElementById('navExpenseCreation').addEventListener('click', function() {
    console.log('Add Expense button clicked');
    // Add your logic to handle adding a new expense
});

document.getElementById('navBalances').addEventListener('click', function() {
    console.log('Settle Up button clicked');
    // Add your logic to handle settling up
});


// document.getElementById('navSettings').addEventListener('click', function() {
//     console.log('Settings button clicked');
//     // Add your logic to handle settling up
// });


// Render expenses and navbar when the page loads
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus(); // Check authentication status on page load

    initNavbar('Group Name', "A1B2C3"); // @TODO - Replace with group name
    ExpensesArrayModule.populateExpenses([]);
    renderExpenses();

    // add event listener for back button
    document.getElementById('navExpenseCreation').addEventListener('click', function() {
        window.location.href = '/expense-create.html'; // Redirect to the landing page
    });

    document.getElementById('navBalances').addEventListener('click', function() {
        window.location.href = '/settle-up.html'; // Redirect to the landing page
    });
    
    // document.getElementById('navSettings').addEventListener('click', function() {
    //     window.location.href = '/group-edit.html'; // Redirect to the landing page
    // });

    async function checkAuthStatus() {
        try {
            // Check if cookies are set
            document.cookie.split('; ').forEach(cookie => {
                const [name, value] = cookie.split('=');
                if (name === 'groupId') 
                {
                    groupId = value;
                } else if (name === 'authToken') {
                    authToken = value;
                } else if (name === 'password_enforced') {
                    password_enforced = Boolean(parseInt(value, 10));
                }
            });
            // Check if the user is authenticated
            if (groupId && authToken) {
                // User is authenticated, proceed to member login
                // can stay on page
            } else {
                // User is not authenticated, show error message or redirect to login page
                console.log('User is not authenticated');
                console.log(groupId? groupId : "No group ID found in cookies");
                console.log(authToken? authToken : "No auth token found in cookies");
                console.log(document.cookie);
                // Redirect to landing page
                window.location.href = '/landingpage'; // Uncomment this line to redirect to login page
            }
        } 
        catch (error) 
        {
            console.error('Error checking authentication status:', error);
        }
    }
});

const ui = {
    confirm: async (message) => createConfirm(message)
};

const createConfirm = () => {
    return new Promise((complete) => {

        
        const confirmYes = document.getElementById('confirmYes');
        const confirmNo = document.getElementById('confirmNo');
        const confirmBox = document.querySelector('.confirm');
        
        confirmYes.replaceWith(confirmYes.cloneNode(true));
        confirmNo.replaceWith(confirmNo.cloneNode(true));
        
        document.getElementById('confirmYes').addEventListener('click', () => {
            confirmBox.style.display = 'none';
            complete(true);
        });
        
        document.getElementById('confirmNo').addEventListener('click', () => {
            confirmBox.style.display = 'none';
            complete(false);
        });
        
        confirmBox.style.display = 'block';
    });
};

const save = async () => {
    const confirm = await ui.confirm();
    
    if (confirm) {
        alert('Group Deleted');

        //go back to landingpage
        window.location.href = "/landingpage";

        //handle log out here @junwei

        //delete group
        DeleteGroup();
    } else {
    }
};


  
const deleteButton = document.getElementById('deleteGroup');
if (deleteButton) {
    deleteButton.addEventListener('pointerdown', save);
}