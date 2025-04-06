// Amounts are stored as integers (cents) to avoid floating point issues
// This function formats the amount as currency
function formatAmount(amount) {
    // Convert cents to dollars and format with 2 decimal places
    absAmt = Math.abs(amount);
    return Math.floor(absAmt / 100).toString() + '.' + Math.floor(absAmt % 100).toString().padStart(2, '0');
}

// This function reads a string in format X.XX
// and returns it as the number of cents
function readAmount(amountString) {    
    const parts = amountString.replace(/[^0-9.]/g, '').split('.');
    let numericalAmount = 0;
    if (parts.length === 1) {
        // convert the dollars to cents
        numericalAmount = parseInt(parts[0], 10) * 100;
    } else if(parts.length > 1) {
        // add the dollars * 100 and cents
        numericalAmount = parseInt(parts[0], 10) * 100 + parseInt(parts[1], 10);
    }

    return numericalAmount || 0;
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

document.addEventListener('DOMContentLoaded', function()  {

    // logout button
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            // Perform logout action here, e.g., redirect to landing page and clear cookies
            console.log('Logout button clicked');
            // Redirect to landing page
            window.location.href = '/landingpage';
            // Clear cookies (if needed)
            document.cookie.split(";").forEach(function(cookie) {
                const name = cookie.split("=")[0].trim();
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
            });
        });
    }
});