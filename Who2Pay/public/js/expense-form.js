//const { format } = require("../../config/db");

// Sample list of people
const people = ["John Doe", "Mary Jane", "Gary Stu", "Bjarne Stroustrup"];

const payeeAmountsPaid = [0.00, 0.00, 0.00, 0.00]; // Array to hold amounts paid by each payee
const payerAmountsToPay = [0.00, 0.00, 0.00, 0.00]; // Array to hold amounts to be paid by each payer

function populateInitialData() { 
	// @TODO - if coming from the expense list page, should populate the fields with the transaction details

}

// Function to calculate the final total
function calculateTotal() {
	subtotalElement = document.getElementById('subtotal');
	additionalChargeElement = document.getElementById('additionalCharge');
	
	// Parse input: Ensure only one decimal point
	subtotalElement.value = subtotalElement.value.replace(/[^0-9.]/g, '');
	const parts = subtotalElement.value.split('.');
	if (parts.length > 2) {
		subtotalElement.value = parts[0] + '.' + parts.slice(1).join('');
	}

	additionalChargeElement.value = additionalChargeElement.value.replace(/[^0-9.]/g, '');
	const parts2 = additionalChargeElement.value.split('.');
	if (parts2.length > 2) {
		additionalChargeElement.value = parts[0] + '.' + parts.slice(1).join('');
	}
	
	const subtotal = readAmount(document.getElementById('subtotal').value) || 0;
	const additionalCharge = readAmount(document.getElementById('additionalCharge').value) || 0;
	const finalTotal = subtotal + additionalCharge;
	document.getElementById('finalTotal').value = formatAmount(finalTotal);
	
	// After total is calculated, update payer and payee amounts
	updatePayeeAmounts();
	updatePayerAmounts();
	
	// Validate the form
	validateForm();
}

// Function to update payee amounts in equal split
function updatePayeeAmounts() {
	const splitMethod = document.getElementById('payeeSplitMethod').value;
	if (splitMethod === 'Equal Amounts') {
		const finalTotal = readAmount(document.getElementById('finalTotal').value) || 0;
		const selectedPayees = document.querySelectorAll('.payee-participation:checked');
		const countSelectedPayees = selectedPayees.length;
		
		if (countSelectedPayees > 0) {
			const amountPerPayee = finalTotal / countSelectedPayees;
			
			// Update all payee amount displays
			document.querySelectorAll('.payee-participation').forEach(checkbox => {
				const index = checkbox.dataset.index;
				const amountElement = document.querySelector(`.payee-amount-display[data-index="${index}"]`);
				
				if (checkbox.checked) {
					amountElement.textContent = `$${formatAmount(amountPerPayee)}`;
					payeeAmountsPaid[index] = amountPerPayee; // Update the payee amounts array
				} else {
					amountElement.textContent = '\$0.00';
					payeeAmountsPaid[index] = 0.00; // Update the payee amounts array
				}
			});
		}
	} 
}

// Function to validate the form
function validateForm() {
	const saveButton = document.getElementById('submit');
	const expenseName = document.getElementById('expenseName').value.trim();
	const finalTotal = parseFloat(document.getElementById('finalTotal').value) || 0;
	const payeeSplitMethod = document.getElementById('payeeSplitMethod').value;
	const payerSplitMethod = document.getElementById('payerSplitMethod').value;
	
	const payeeErrorMessage = document.getElementById('payeeErrorMessage');
	const payerErrorMessage = document.getElementById('payerErrorMessage');
	const payeeNoSelectionMessage = document.getElementById('payeeNoSelectionMessage');
	const payerNoSelectionMessage = document.getElementById('payerNoSelectionMessage');
	
	let isValid = true;
	
	// Check if expense name is set
	if (expenseName === '') {
		isValid = false;
	}
	
	// Check if total is zero
	if (finalTotal <= 0) {
		isValid = false;
	}
	
	// Check payee amounts based on split method
	if (payeeSplitMethod === 'Custom Amounts') {
		const payeeTotal = calculatePayeeTotal();
		if (Math.abs(payeeTotal - finalTotal) > 0.01) { // Allow small rounding differences
			isValid = false;
			payeeErrorMessage.style.display = 'block';
		} else {
			payeeErrorMessage.style.display = 'none';
		}
		payeeNoSelectionMessage.style.display = 'none';
	} else { // Equal Amounts
		payeeErrorMessage.style.display = 'none';
		
		// Check if at least one payee is selected
		const hasSelectedPayee = document.querySelectorAll('.payee-participation:checked').length > 0;
		if (!hasSelectedPayee) {
			isValid = false;
			payeeNoSelectionMessage.style.display = 'block';
		} else {
			payeeNoSelectionMessage.style.display = 'none';
		}
	}
	
	// Check payer amounts based on split method
	if (payerSplitMethod === 'Custom Amounts') {
		const payerTotal = calculatePayerTotal();
		if (Math.abs(payerTotal - finalTotal) > 0.01) { // Allow small rounding differences
			isValid = false;
			payerErrorMessage.style.display = 'block';
		} else {
			payerErrorMessage.style.display = 'none';
		}
		payerNoSelectionMessage.style.display = 'none';
	} else { // Equal Amounts
		payerErrorMessage.style.display = 'none';
		
		// Check if at least one payer is selected
		const hasSelectedPayer = document.querySelectorAll('.payer-participation:checked').length > 0;
		if (!hasSelectedPayer) {
			isValid = false;
			payerNoSelectionMessage.style.display = 'block';
		} else {
			payerNoSelectionMessage.style.display = 'none';
		}
	}
	
	// Enable or disable save button
	saveButton.disabled = !isValid;
}

// Function to calculate total of payee amounts
function calculatePayeeTotal() {
	let total = 0;
	document.querySelectorAll('.payee-amount').forEach(input => {
		total += readAmount(input.value) || 0;
	});
	return total;
}

// Function to calculate total of payer amounts
function calculatePayerTotal() {
	let total = 0;
	document.querySelectorAll('.payer-amount-input').forEach(input => {
		total += readAmount(input.value) || 0;
	});
	return total;
}

// Function to update payer amounts (to be filled in by user)
function updatePayerAmounts() {
	// Handle equal split logic
	const splitMethod = document.getElementById('payerSplitMethod').value;
	if (splitMethod === 'Equal Amounts') {
		const finalTotal = readAmount(document.getElementById('finalTotal').value) || 0;
		const selectedPayers = document.querySelectorAll('.payer-participation:checked');
		const countSelectedPayers = selectedPayers.length;
		
		if (countSelectedPayers > 0) {
			const amountPerPayer = finalTotal / countSelectedPayers;
			
			// Update all payer amount displays
			document.querySelectorAll('.payer-participation').forEach(checkbox => {
				const index = checkbox.dataset.index;
				const amountElement = document.querySelector(`.payer-amount[data-index="${index}"]`);
				
				if (checkbox.checked) {
					amountElement.textContent = `$${formatAmount(amountPerPayer)}`;
					payerAmountsToPay[index] = amountPerPayer; // Update the payer amounts array
				} else {
					amountElement.textContent = '\$0.00';
					payerAmountsToPay[index] = 0.00; // Update the payer amounts array
				}
			});
		}
	} 
	
	// Validate the form
	validateForm();
}

// Function to populate payees
function populatePayees() {
	const payeesList = document.getElementById('payeesList');
	payeesList.innerHTML = '';
	
	const splitMethod = document.getElementById('payeeSplitMethod').value;
	
	people.forEach((person, index) => {
		const row = document.createElement('div');
		row.className = 'person-row';
		
		if (splitMethod === 'Equal Amounts') {
			row.innerHTML = `
				<div class="payee-info">
					<div class="person-name">${person}</div>
					<div class="payee-amount-display" data-index="${index}">\$0.00</div>
				</div>
				<div class="person-amount">
					<input type="checkbox" class="payee-participation" data-index="${index}" ${payeeAmountsPaid[index] > 0 ? 'checked' : ''}>
				</div>
			`;
		} else { // Custom Amounts
			row.innerHTML = `
				<div class="payee-info">
					<div class="person-name">${person}</div>
					<div class="payee-amount-display" data-index="${index}">\$0.00</div>
				</div>
				<div class="person-amount">
					<span class="currency">$</span>
					<input type="text" class="payee-amount" data-index="${index}" value="${formatAmount(payeeAmountsPaid[index])}">
				</div>
			`;
		}
		
		payeesList.appendChild(row);
	});
	
	// Add event listeners to inputs
	if (splitMethod === 'Equal Amounts') {
		document.querySelectorAll('.payee-participation').forEach(input => {
			input.addEventListener('change', function() {
				// Handle checkbox changes
				updatePayeeAmounts();
				validateForm();
			});
		});
		
		// Initial update for equal amounts
		updatePayeeAmounts();
	} else {
		document.querySelectorAll('.payee-amount').forEach(input => {
			input.addEventListener('input', function() {
    
				// Parse input: Ensure only one decimal point
				input.value = input.value.replace(/[^0-9.]/g, '');
				const parts = input.value.split('.');
				if (parts.length > 2) {
					input.value = parts[0] + '.' + parts.slice(1).join('');
				}
				
				// Custom amounts logic
				const index = input.dataset.index;
				const amount = readAmount(input.value) || 0;
				payeeAmountsPaid[index] = amount; // Update the payee amounts array
				
				const amountElement = document.querySelector(`.payee-amount-display[data-index="${index}"]`);
				amountElement.textContent = '$' + input.value;

				// Handle amount changes
				validateForm();
			});

			input.addEventListener('focusout', function(e) {
				input.value = formatAmount(readAmount(input.value));
				const index = input.dataset.index;
				document.querySelector(`.payee-amount-display[data-index="${index}"]`).textContent = '$' + input.value;
				console.log("input lost focus");
			});
		});
	}
	
	// Reset error messages when split method changes
	document.getElementById('payeeErrorMessage').style.display = 'none';
	document.getElementById('payeeNoSelectionMessage').style.display = 'none';
	
	// Validate the form
	validateForm();
}

// Function to populate payers
function populatePayers() {
	const payersList = document.getElementById('payersList');
	payersList.innerHTML = '';
	
	const splitMethod = document.getElementById('payerSplitMethod').value;
	
	people.forEach((person, index) => {
		const row = document.createElement('div');
		row.className = 'person-row';
		
		if (splitMethod === 'Equal Amounts') {
			row.innerHTML = `
				<div class="payer-info">
					<div class="person-name">${person}</div>
					<div class="payer-amount" data-index="${index}">\$0.00</div>
				</div>
				<div class="person-amount">
					<input type="checkbox" class="payer-participation" data-index="${index}" ${payerAmountsToPay[index] > 0 ? 'checked' : ''}>
				</div>
			`;
		} else { // Custom Amounts
			row.innerHTML = `
				<div class="payer-info">
					<div class="person-name">${person}</div>
					<div class="payer-amount" data-index="${index}">$${formatAmount(payerAmountsToPay[index])}</div>
				</div>
				<div class="person-amount">
					<span class="currency">$</span>
					<input type="text" class="payer-amount-input" data-index="${index}" value="${formatAmount(payerAmountsToPay[index])}">
				</div>
			`;
		}
		
		payersList.appendChild(row);
	});
	
	// Add event listeners
	if (splitMethod === 'Equal Amounts') {
		document.querySelectorAll('.payer-participation').forEach(input => {
			input.addEventListener('change', function() {
				updatePayerAmounts();
				validateForm();
			});
		});
		
		// Initial update for equal amounts
		updatePayerAmounts();
	} else {
		document.querySelectorAll('.payer-amount-input').forEach(input => {
			input.addEventListener('input', function() {

				// Parse input: Ensure only one decimal point
				input.value = input.value.replace(/[^0-9.]/g, '');
				const parts = input.value.split('.');
				if (parts.length > 2) {
					input.value = parts[0] + '.' + parts.slice(1).join('');
				}
				
				// Custom amounts logic
				const index = input.dataset.index;
				const amount = readAmount(input.value) || 0;
				payerAmountsToPay[index] = amount; // Update the payer amounts array
				
				const amountDisplay = document.querySelector(`.payer-amount[data-index="${index}"]`);
				amountDisplay.textContent = '$' + input.value;
				
				validateForm();
			});			

			input.addEventListener('focusout', function(e) {
				input.value = formatAmount(readAmount(input.value));
				const index = input.dataset.index;
				document.querySelector(`.payer-amount[data-index="${index}"]`).textContent = '$' + input.value;
				console.log("input lost focus");
			});
		});
	}
	
	// Reset error messages when split method changes
	document.getElementById('payerErrorMessage').style.display = 'none';
	document.getElementById('payerNoSelectionMessage').style.display = 'none';
	
	// Validate the form
	validateForm();
}

function saveExpense() {
	// Save button logic here
	// Compute the transaction details using 
	// the values in the arrays "payeeAmountsPaid" and "payerAmountsToPay"
	if(document.getElementById('submit').disabled) {
		console.log("saveExpense called but button is not enabled");
		return;
	}

	console.log("saveExpense called. payee amounts: ", payeeAmountsPaid, " payer amounts: ", payerAmountsToPay);
	// get form data
	const finalTotal = readAmount(document.getElementById('finalTotal').value) || 0;
	const payeeSplitMethod = document.getElementById('payeeSplitMethod').value;
	const payerSplitMethod = document.getElementById('payerSplitMethod').value;

	// use test group id for now
	const testGroupId = 1;

	// create transaction object for this expense
	const transactionData = {
		groupId: testGroupId,
		splitType: `${payeeSplitMethod}/${payerSplitMethod}`,
		totalAmount: finalTotal
	}

	// create transactionDetails
	const transactionDetails = [];

	payeeAmountsPaid.forEach((amount, index) => {
		// only include payees with amount > 0
		if(amount > 0) {
			transactionDetails.push({
				payerId: null, // participants don't pay
				participantId: index,
				amount: amount
			});
		}
	});

	payerAmountsToPay.forEach((amount, index) => {
		if(amount > 0) {
			transactionDetails.push({
				payerId: index,
				participantId: null,
				amount: amount
			})
		}
	});

	console.log("Transaction data to be saved:", {
		transactionData: transactionData,
		transactionDetails: transactionDetails
	})
}

function backButtonPressed() {
	if(!document.getElementById('return').disabled)
		navigateToPage("ExpenseList");
}

// Event listeners for amount fields
document.getElementById('subtotal').addEventListener('input', calculateTotal);
document.getElementById('subtotal').addEventListener('focusout', function(e) {
	this.value = formatAmount(readAmount(this.value));
	const index = this.dataset.index;
	this.textContent = this.value;
	console.log("input lost focus");
});
document.getElementById('additionalCharge').addEventListener('input', calculateTotal);
document.getElementById('additionalCharge').addEventListener('focusout', function(e) {
	this.value = formatAmount(readAmount(this.value));
	const index = this.dataset.index;
	this.textContent = this.value;
	console.log("input lost focus");
});

// Event listener for expense name
document.getElementById('expenseName').addEventListener('input', validateForm);

// Event listeners for split method changes
document.getElementById('payeeSplitMethod').addEventListener('change', populatePayees);
document.getElementById('payerSplitMethod').addEventListener('change', populatePayers);

// Event listener for buttons
document.getElementById('submit').addEventListener('pointerdown', saveExpense);
document.getElementById('return').addEventListener('pointerdown', backButtonPressed);

// Initialize the form
document.addEventListener('DOMContentLoaded', function() {
	populatePayees();
	populatePayers();
	populateInitialData(); // @TODO - if coming from the expense list page, should populate the fields with the transaction details
	calculateTotal();
	validateForm();
});