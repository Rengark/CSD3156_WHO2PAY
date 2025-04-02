let members = ["John Doe", "Jane Smith", "Alice Johnson"]; // Example members array
let firsttimeusers = [true, false, true]; // Example firsttimeusers array
let grpowner = "John Doe"; // Example group owner
let grpname = "test";



function togglePassword() {
    const passwordField = document.getElementsByClassName("pswd");
    //loop all password fieldds
    for (let i = 0; i < passwordField.length; i++) {
        passwordField[i].type = passwordField[i].type === "password" ? "text" : "password";
    }
    //change icon from 🐵 to 🙈
    const passbuttontext = document.getElementsByClassName("eyeToggle");
    //loop all password fieldds
    for (let i = 0; i < passbuttontext.length; i++) {
        passbuttontext[i].innerText = passwordField[i].type === "password" ? "🙈" : "🐵";
    }

}

// Event listener for save button


function switchToGroupOwnerUI() {
    if(members.length === 0) {
        document.getElementById("grpwarning").style.display = "block";
        return;
    }

    document.getElementById("createGroupUI").style.display = "none";
    document.getElementById("groupOwnerUI").style.display = "block";
    
    const nameDropdown = document.getElementById("ownerName");
    nameDropdown.innerHTML = "";
    members.forEach(member => {
        const option = document.createElement("option");
        option.value = member;
        option.textContent = member;
        nameDropdown.appendChild(option);
    });
}



var et = document.getElementsByClassName('eyeToggle');
if(et.length > 0) {
    for (let i = 0; i < et.length; i++) {
        et[i].addEventListener('pointerdown', togglePassword);
    }
}


function JoinGroup()
{
    const groupName = document.getElementById("groupName").value;
    const groupPassword = document.getElementById("groupPassword").value;
    
    //need to get the database, and check for grp name and grp password here
    //using the hardcoded grpname and password for now
    if (groupName === grpname && groupPassword === "123") 
    {
        document.getElementById("grpwarning").style.display = "none";
        ChangeToMemberLoginUI();

    } else 
    {
        document.getElementById("grpwarning").style.display = "block";
    }
}

var joingrp = document.getElementById('join')
if (joingrp) {
    joingrp.addEventListener('pointerdown', JoinGroup);
}

function ChangeToMemberLoginUI() 
{
    //use db to get a list of users but we have hardcoded user for now
    //fill up members array with the list of users

    //fill the dropdown in the member login UI with the list of users
    dropdown = document.getElementById("userName");
    dropdown.innerHTML = "";
    
    const d = document.createElement("option");
    d.value = "none";
    d.textContent = "Select a user";
    dropdown.appendChild(d);

    members.forEach(member => {
        const option = document.createElement("option");
        option.value = member;
        option.textContent = member;
        dropdown.appendChild(option);
    });

    //set welcome message
    const welcomeMessage = document.getElementById("wlc");
    //welcome message says welcome to groupname
    welcomeMessage.innerText = "Welcome to " + grpname + "!";


    document.getElementById("joingroupUI").style.display = "none";
    document.getElementById("memberloginUI").style.display = "block";
}

//when something is selected in the dropdown, show the password field
function showPasswordField() {
    const selectedValue = document.getElementById("userName").value;
    const passwordField = document.getElementById("memberPasswordContainer");
    const newUserPasswordField = document.getElementById("newMemberPasswordContainer");
    if (selectedValue !== "none") {
        checkFirstTimeUser(selectedValue);
    } else {
        passwordField.style.display = "none";
        newUserPasswordField.style.display = "none";
    }
}

function checkFirstTimeUser()
{
    //use db to check but we have sample array for now
    //the order of the boolean array corresponds to the user
    //in the members array
    const selectedValue = document.getElementById("userName").value;
    const index = members.indexOf(selectedValue);
    const isFirstTimeUser = firsttimeusers[index];
    const passwordField = document.getElementById("memberPasswordContainer");
    const newUserPasswordField = document.getElementById("newMemberPasswordContainer");

    if (isFirstTimeUser) {
        passwordField.style.display = "none";
        newUserPasswordField.style.display = "block";
    } else {
        passwordField.style.display = "block";
        newUserPasswordField.style.display = "none";
    }
}

function backToLandingPage()
{
    //go back to landing page
    document.getElementById("memberloginUI").style.display = "none";
    document.getElementById("joingroupUI").style.display = "block";

    //reset passwordblocks
    const passwordField = document.getElementById("memberPasswordContainer");
    const newUserPasswordField = document.getElementById("newMemberPasswordContainer");
    passwordField.style.display = "none";
    newUserPasswordField.style.display = "none";
}


var dropdown = document.getElementById("userName");
if (dropdown) {
    dropdown.addEventListener("change", showPasswordField);
}

var backbtn = document.getElementById('backtofg')
if (backbtn) {
    backbtn.addEventListener('pointerdown', backToLandingPage);
}