let members = ["John Doe", "Jane Smith", "Alice Johnson"]; // Example members array ->get from db
let firsttimeusers = [true, false, true]; // Example firsttimeusers array ->get from db
let grpowner = "John Doe"; // Example group owner ->need to get from db
let grpname = "test"; // ->after login in get from db

let newMembers = []; // Array to hold new members to be added
let groupId = null;
let authToken = null;
let password_enforced = null;

//query page load call OnPageLoadGetUsers -> can fill data here
window.onload = function() {
    updateMemberList();
    updateGroupNameandPassword();
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


//uppdate member list
function updateMemberList() {
    const list = document.getElementById("membersList");
    list.innerHTML = "";
    members.forEach((member, index) => {
        const memberDiv = document.createElement("div");
        memberDiv.className = "member";
        memberDiv.innerHTML = ` ${member}`;
        list.appendChild(memberDiv);
        const idname = 'removeMember' + index;
    });

    newMembers.forEach((member, index) => {
        const memberDiv = document.createElement("div");
        memberDiv.className = "member";
        memberDiv.innerHTML = ` ${member}`;
        //create a remove button
        const removebutton = document.createElement("button");
        removebutton.innerText = "X";
        removebutton.id = "removeMember" + index;
        removebutton.className = "delete-btn";
        removebutton.style.cursor = "pointer";
        removebutton.addEventListener('pointerdown', () => removeMember(index));
        memberDiv.appendChild(removebutton);
        list.appendChild(memberDiv);
    });

}

function removeMember(index) {
    newMembers.splice(index, 1);
    updateMemberList();
}


function updateGroupNameandPassword()
{
    //set the value of the group name and password input
    const groupName = document.getElementById("groupname");
    const groupPassword = document.getElementById("grouppassword");
    groupName.value = grpname;
    groupPassword.value = "123"; //hardcoded password for now
}




function confirmMember() {
    const input = document.getElementById("newMemberName");
    const name = input.value.trim();
    if (name && !members.some(item => item.toLowerCase() == name.toLowerCase()) && !newMembers.some(item => item.toLowerCase() == name.toLowerCase())) {
        newMembers.push(name);
        updateMemberList();
    }
    document.getElementById("addMemberContainer").innerHTML = ""; // Clear input field
    document.getElementById("add").style.visibility = 'visible';
}


function showAddMemberInput() {
    const container = document.getElementById("addMemberContainer");
    container.innerHTML = `
        <input type="text" id="newMemberName" placeholder="Enter member name">
        <button id="confirmMember" class="green btn" style = "margin-top: 5px;">Confirm</button>
    `;
    document.getElementById('confirmMember').addEventListener('pointerdown', confirmMember);
    document.getElementById("add").style.visibility = 'hidden';
}


const addButton = document.getElementById('add');
if (addButton) {
    addButton.addEventListener('pointerdown', showAddMemberInput);
}


function DeleteGroup()
{
    // run delete group query here
    fetch('/query/deleteGroup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ groupID: groupId })
    });
}



//add new members into database
//check group name and group password if it changed, if it did update the database
//@junwei
function SaveGroupSettings()
{
    //get group name and password
    const groupName = document.getElementById("groupname").value;
    const groupPassword = document.getElementById("grouppassword").value;

    //add new member list to db
    newMembers;
}

const ui = {
    confirm: async (message) => createConfirm(message)
};

const createConfirm = () => {
    return new Promise((complete) => {

        
        const confirmYes = document.getElementById('confirmYes');
        const confirmNo = document.getElementById('confirmNo');
        const confirmBox = document.querySelector('.confirm');
        
        confirmYes.replaceWith(confirmYes.cloneNode(true));
        confirmNo.replaceWith(confirmNo.cloneNode(true));
        
        document.getElementById('confirmYes').addEventListener('click', () => {
            confirmBox.style.display = 'none';
            complete(true);
        });
        
        document.getElementById('confirmNo').addEventListener('click', () => {
            confirmBox.style.display = 'none';
            complete(false);
        });
        
        confirmBox.style.display = 'block';
    });
};

const save = async () => {
    const confirm = await ui.confirm();
    
    if (confirm) {
        alert('Group Deleted');

        //go back to landingpage
        window.location.href = "/landingpage";

        //handle log out here @junwei

        //delete group
        DeleteGroup();
    } else {
    }
};


  
const deleteButton = document.getElementById('deleteGroup');
if (deleteButton) {
    deleteButton.addEventListener('pointerdown', save);
}


function GoBack()
{
    //go back to expanse list
    window.location.href = "/expense-list";
}

const backButton = document.getElementById('backbtn');
if (backButton) {
    backButton.addEventListener('pointerdown', GoBack);
}

document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus(); // Check authentication status on page load


    async function checkAuthStatus() {
        try {
            // Check if cookies are set
            document.cookie.split('; ').forEach(cookie => {
                const [name, value] = cookie.split('=');
                if (name === 'groupId') 
                {
                    groupId = value;
                } else if (name === 'authToken') {
                    authToken = value;
                } else if (name === 'password_enforced') {
                    password_enforced = Boolean(parseInt(value, 10));
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
        } 
        catch (error) 
        {
            console.error('Error checking authentication status:', error);
        }
    }
});