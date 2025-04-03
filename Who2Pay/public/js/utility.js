// Amounts are stored as integers (cents) to avoid floating point issues
// This function formats the amount as currency
function formatAmount(amount) {
    // Convert cents to dollars and format with 2 decimal places
    return '$' + Math.abs(amount / 100).toFixed(2);
}

function navigateToPage(pageName) {
    console.log(`[navigateToPage] Called with arg ${pageName}`);
}