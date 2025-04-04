// Amounts are stored as integers (cents) to avoid floating point issues
// This function formats the amount as currency
function formatAmount(amount) {
    // Convert cents to dollars and format with 2 decimal places
    absAmt = Math.abs(amount);
    return '$' + Math.floor(absAmt / 100) + '.' + Math.floor(absAmt % 100).toString().padStart(2, '0');
}

// Function to format date as (D)D Month YYYY
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}


function navigateToPage(pageName) {
    console.log(`[navigateToPage] Called with arg ${pageName}`);
}


// Function to copy text to clipboard
function copyToClipboard(text) {
    // Using the modern Clipboard API
    navigator.clipboard.writeText(text)
        .then(() => {
            // Show a brief visual feedback (optional)
            const copyBtn = document.getElementById('copyBtn');
            const originalIcon = copyBtn.innerHTML;
            copyBtn.innerHTML = '<span class="material-icons">check</span>';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalIcon;
            }, 1500);
            
            //console.log('Session code copied to clipboard!');
        })
        .catch(err => {
            console.error('Could not copy text: ', err);
        });
}