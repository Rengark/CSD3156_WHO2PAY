// Amounts are stored as integers (cents) to avoid floating point issues
const balances = [
    { name: "John Doe", amount: 0 },
    { name: "Mary Jane", amount: -500 },
    { name: "Gary Stu", amount: 270 },
    { name: "Bjarne Stroustrup", amount: 0 }
];


// Function to populate the balances list
function renderBalances() {
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
                arrowButton.className = 'arrow-button arrow-red';
                arrowButton.innerHTML = '→';
                balanceWrapper.appendChild(arrowButton);
            } else {
                balanceStatus.textContent = 'You are owed:';
                balanceAmount.textContent = formatAmount(balance.amount);
                
                // Create green arrow button
                const arrowButton = document.createElement('button');
                arrowButton.className = 'arrow-button arrow-green';
                arrowButton.innerHTML = '→';
                balanceWrapper.appendChild(arrowButton);
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
    if(!backButton.disabled)
        navigateToPage("ExpenseList");
}

document.getElementById('backButton').addEventListener('pointerdown', backButtonPressed);

// Initialize the page
renderBalances();