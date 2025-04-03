let members = ["John Doe", "Jane Smith", "Alice Johnson"]; // Example members array ->get from db
let firsttimeusers = [true, false, true]; // Example firsttimeusers array ->get from db
let grpowner = "John Doe"; // Example group owner ->need to get from db
let grpname = "test"; // ->after login in get from db

let newMembers = []; // Array to hold new members to be added


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
    const groupName = document.getElementById("groupName");
    const groupPassword = document.getElementById("groupPassword");
    groupName.value = grpname;
    groupPassword.value = "123"; //hardcoded password for now
}


//query page load call OnPageLoadGetUsers
window.onload = function() {
    updateMemberList();
    updateGroupNameandPassword();
};

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