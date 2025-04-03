document.addEventListener('DOMContentLoaded', function() {
    // Function to initialize the page with names and amount
    function initializeSettlement(personA, personB, amount) {
        // Set dropdown values
        document.getElementById('person-a').value = personA;
        document.getElementById('person-b').value = personB;
        
        // Set amount in the input field
        document.getElementById('amount').value = parseFloat(amount).toFixed(2);
        
        // Update the info text
        updateInfoText(personA, personB, amount);
    }
    
    // Function to update the info text
    function updateInfoText(personA, personB, amount) {
        const infoText = document.getElementById('info-text');
        infoText.textContent = `${personA} owes ${personB} $${parseFloat(amount).toFixed(2)}`;
    }
    
    // Event listeners for dropdowns
    document.getElementById('person-a').addEventListener('change', function() {
        updateInfoText(
            this.value,
            document.getElementById('person-b').value,
            document.getElementById('amount').value
        );
    });
    
    document.getElementById('person-b').addEventListener('change', function() {
        updateInfoText(
            document.getElementById('person-a').value,
            this.value,
            document.getElementById('amount').value
        );
    });
    
    // Input validation for amount field
    document.getElementById('amount').addEventListener('input', function(e) {
        // Remove any non-numeric characters except period
        this.value = this.value.replace(/[^0-9.]/g, '');
        
        // Ensure only one decimal point
        const parts = this.value.split('.');
        if (parts.length > 2) {
            this.value = parts[0] + '.' + parts.slice(1).join('');
        }
    });
    
    // Example of initializing with values (in a real app, these would come from parameters)
    // This can be replaced with actual initialization logic
    initializeSettlement('John Doe', 'Gary Stu', '3.00');
    
    // Button event listeners
    document.getElementById('backButton').addEventListener('click', function() {
        // Handle back button click (e.g., navigate back or cancel)
        console.log('Back button clicked');
    });
    
    document.getElementById('saveButton').addEventListener('click', function() {
        // Handle save button click (e.g., save the payment)
        const personA = document.getElementById('person-a').value;
        const personB = document.getElementById('person-b').value;
        const amount = document.getElementById('amount').value;
        
        console.log(`Saving payment: ${personA} owes ${personB} $${amount}`);
    });
});