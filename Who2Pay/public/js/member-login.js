let members = ["John Doe", "Jane Smith", "Alice Johnson"]; // Example members array ->get from db
let firsttimeusers = [true, false, true]; // Example firsttimeusers array ->get from db
let grpowner = "John Doe"; // Example group owner ->need to get from db
let grpname = "test"; // ->after login in get from db


//query page load call OnPageLoadGetUsers ->can fill data here
window.onload = function() {
    OnPageLoadGetUsers();
};


//password stuff
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
var et = document.getElementsByClassName('eyeToggle');
if(et.length > 0) {
    for (let i = 0; i < et.length; i++) {
        et[i].addEventListener('pointerdown', togglePassword);
    }
}

//onpage load set the list of users
function OnPageLoadGetUsers() 
{
    //use db to get a list of users but we have hardcoded user for now
    //fill up members array with the list of users

    //fill the dropdown in the member login UI with the list of users
    dropdown = document.getElementById("username");
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
}


//when something is selected in the dropdown, show the password field
function showPasswordField() {
    const selectedValue = document.getElementById("username").value;
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
    const selectedValue = document.getElementById("username").value;
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

var dropdown = document.getElementById("username");
if (dropdown) {
    dropdown.addEventListener("change", showPasswordField);
}

//add exit authentication here @junwei
function logout() 
{
    //clear cookies
    document.cookie = "groupId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Clear groupId cookie
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Clear authToken cookie
    window.location.href = "/landingpage";
}

var logoutbtn = document.getElementById('log-out')
if (logoutbtn) {
    logoutbtn.addEventListener('pointerdown', logout);
}

//login function to check if the user is in the database and password is correct
//or if new user, add new password to db
function login()
{
    //the values u will want to check @junwei
    const selectedValue = document.getElementById("username").value;

    const passwords = document.getElementsByClassName("pswd");
    const password = passwords[0].value;
    const newUserPassword = passwords[1].value;

    window.location.href = "/expense-list";
}

var joinbtn = document.getElementById('join')
if (joinbtn) {
    joinbtn.addEventListener('pointerdown', login);
}


document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();

    async function checkAuthStatus() {
        try {
            // check cookies for group id and auth token
            let groupId = null;
            let authToken = null;
            // Check if cookies are set
            document.cookie.split('; ').forEach(cookie => {
                const [name, value] = cookie.split('=');
                if (name === 'groupId') 
                {
                    groupId = value;
                } else if (name === 'authToken') {
                    authToken = value;
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
        } catch (error) {
            console.error('Error checking authentication status:', error);
        }
    }
});


