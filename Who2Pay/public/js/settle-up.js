
const MembersArrayModule = (() => {
    let membersArray = [];

    return {
        populateMemberList: () => { 
            // @TODO Brandon - populate the expensesArray with expenses formatted as
            // { id: int, expenseName: String, amount: int, date: date in YYYY-MM-DD format}

            membersArray = [
                { id: 69,  name: "name1" },
                { id: 420, name: "name2" },
                { id: 333, name: "name3" },
                { id: 123, name: "name4" },
                { id: 23,  name: "name5" },
                { id: 14,  name: "name6" },
                { id: 72,  name: "name7" },
                { id: 68,  name: "name8" }
            ];
        },
        getMembers: () => [...membersArray], // Return a copy to prevent direct modification
        getCount: () => membersArray.length // Return a copy to prevent direct modification
    };
})();


function populateMemberDropdowns() {    
    const nameDropdowns = document.getElementsByClassName("member-dropdown");

    for (let i = 0; i < nameDropdowns.length; i++) {
        nameDropdowns[i].innerHTML = "";

        if(MembersArrayModule.getCount() === 0) {
            // Add an empty option if member list is empty for some reason            
            const d = document.createElement("option");
            d.value = "none";
            d.textContent = "Select a user";
            nameDropdowns[i].appendChild(d);
        } else {
            // @TODO - idk how you want to retrieve the values
            MembersArrayModule.getMembers().forEach(member => {
                const option = document.createElement("option");
                option.value = member.name;
                option.textContent = member.name;
                nameDropdowns[i].appendChild(option);
            });
            
        }    
    }
}

// Function to initialize the page with names and amount
function initializeSettlement(personA, personB, amount) {
    // Set dropdown values
    document.getElementById('person-a').value = personA;
    document.getElementById('person-b').value = personB;
    
    // Set amount in the input field
    document.getElementById('amount').value = formatAmount(amount);
}

function onChangePersonPaying(newName) {
    // @TODO Brandon or Jun Wei - idk if you want to do anyth here
    console.log(`Changed person paying to ${newName}`);

    // ensure that user does not select the same person for A and B
    let personB = document.getElementById('person-b').value;
    if(personB !== "none" && (personB).toLowerCase() === (newName).toLowerCase()) {
        document.getElementById('personError').style.display = 'block';
    } else {
        document.getElementById('personError').style.display = 'none';
    }

}

function onChangePersonReceiving(newName) {
    // @TODO Brandon or Jun Wei - idk if you want to do anyth here
    console.log(`Changed person receiving money to ${newName}`);
    
    // ensure that user does not select the same person for A and B
    let personA = document.getElementById('person-a').value;
    if(personA !== "none" && (personA).toLowerCase() === (newName).toLowerCase()) {
        document.getElementById('personError').style.display = 'block';
    } else {
        document.getElementById('personError').style.display = 'none';
    }
}

function onChangeAmount(newAmount) {
    // @TODO Brandon or Jun Wei - idk if you want to do anyth here
    let numericalAmount = readAmount(newAmount);
    console.log(`Changed amount to $${newAmount} (${numericalAmount} cents)`)
}

// Event listeners for dropdowns
document.getElementById('person-a').addEventListener('change', function() {
    onChangePersonPaying(this.value);
});

document.getElementById('person-b').addEventListener('change', function() {
    onChangePersonReceiving(this.value);
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

    onChangeAmount(this.value);
});


// Button event listeners
document.getElementById('return').addEventListener('click', function(e) {
    e.preventDefault();
    // Handle back button click (e.g., navigate back or cancel)
    console.log('Back button clicked');
    window.location.href = "/expense-list.html"; // Change to the appropriate URL
});

document.getElementById('submit').addEventListener('click', function() {
    console.log("Save button clicked.")

    // Handle save button click (e.g., save the payment)
    const personA = document.getElementById('person-a').value;
    const personB = document.getElementById('person-b').value;
    const amount = document.getElementById('amount').value;

    if(personA === "none" || personB === "none") {
        console.log(`Person A or B's value is \"none\"` );
    } else if((personA).toLowerCase() === (personB).toLowerCase()) {
        console.log(`Person A or B's values are the same` );
        document.getElementById('personError').style.display = 'block';
    }
    
    const numericalAmount = readAmount(amount);
    console.log(`${personA} paid ${personB} $${amount} (${numericalAmount} cents)` );
});


document.addEventListener('DOMContentLoaded', function() {
    MembersArrayModule.populateMemberList();
    populateMemberDropdowns();
    initializeSettlement('name1', 'name2', '300');
});