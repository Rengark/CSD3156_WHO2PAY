// Queries all the transactions involving this user, 
// collates the total amount the user owes / is owed
// and returns it as an array of structs with the format
// { id : int, name : String, amount: int (amount of money in cents) }
// If the amount is negative, the user owes that person money.
// If the amount is positive, the user is owed money 
function getBalanceSummary() {

    // @TODO Brandon - Add query logic to retrieve all transactions the current user is involved in

    // Amounts are stored as integers (cents) to avoid floating point issues
    const balances = [
        { id: 1111, name: "Jane", amount: -400 },
        { id: 3333, name: "James", amount: 0 },
        { id: 4444, name: "Jess", amount: 0 }
    ];

    return balances;
}

// ID of the user currently logged in
// temp variable for testing
let currentUserId = 9999;

// Function to populate the balances list
function renderBalances(balances) {
    const balancesList = document.getElementById('balances-list');
    balancesList.innerHTML = '';
    
    balances.forEach(balance => {
        const row = document.createElement('div');
        row.className = 'balance-row';
        
        // Create name element
        const nameElement = document.createElement('div');
        nameElement.className = 'balance-name';
        nameElement.textContent = balance.name;
        
        // Create balance wrapper
        const balanceWrapper = document.createElement('div');
        balanceWrapper.className = 'balance-wrapper';
        
        // Create balance info element
        const balanceInfo = document.createElement('div');
        balanceInfo.className = 'balance-info';
        
        const balanceStatus = document.createElement('div');
        balanceStatus.className = 'balance-status';
        
        if (balance.amount === 0) {
            balanceStatus.textContent = 'Settled up';
        } else {
            const balanceAmount = document.createElement('div');
            balanceAmount.className = 'balance-amount';
            
            if (balance.amount < 0) {
                balanceStatus.textContent = 'You owe:';
                balanceAmount.textContent = formatAmount(balance.amount);
                
                // Create red arrow button
                const arrowButton = document.createElement('button');
                arrowButton.className = 'square-btn dark-red';
                arrowButton.innerHTML = '→';
                balanceWrapper.appendChild(arrowButton);
                
                arrowButton.addEventListener('pointerdown', function() {
                    goToSettleUpPage(currentUserId, balance.id, -balance.amount);
                });
            } else {
                balanceStatus.textContent = 'You are owed:';
                balanceAmount.textContent = formatAmount(balance.amount);
                
                // Create green arrow button
                const arrowButton = document.createElement('button');
                arrowButton.className = 'square-btn light-green';
                arrowButton.innerHTML = '→';
                balanceWrapper.appendChild(arrowButton);                

                arrowButton.addEventListener('pointerdown', function() {
                    goToSettleUpPage(balance.id, currentUserId, balance.amount);
                });
            }
            
            balanceInfo.appendChild(balanceAmount);
        }
        
        balanceInfo.prepend(balanceStatus);
        balanceWrapper.prepend(balanceInfo);
        
        row.appendChild(nameElement);
        row.appendChild(balanceWrapper);
        
        balancesList.appendChild(row);
    });
}

// Function for the back button
function backButtonPressed() {
    if(!document.getElementById('return').disabled)
        navigateToPage("ExpenseList");
}

// Function to navigate to the settle up page
// id1 - Person A paying person B
// id2 - Person B being paid by person A
// amount - money in cents being paid to person B
function goToSettleUpPage(id1, id2, amount) {
    navigateToPage(`Settle Up between ${id1} and ${id2} (\$${amount})`);
}

document.getElementById('return').addEventListener('pointerdown', backButtonPressed);

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderBalances(getBalanceSummary());
});