let members = [];
//empty owner to be set later
let owner = "";

function showAddMemberInput() {
    const container = document.getElementById("addMemberContainer");
    container.innerHTML = `
        <input type="text" id="newMemberName" placeholder="Enter member name">
        <button id="confirmMember" class="green btn" style = "margin-top: 5px;">Confirm</button>
    `;
    document.getElementById('confirmMember').addEventListener('pointerdown', confirmMember);
    document.getElementById("add").style.visibility = 'hidden';
}

function confirmMember() {
    const input = document.getElementById("newMemberName");
    const name = input.value.trim();
    if (name && !members.some(item => item.toLowerCase() == name.toLowerCase())) {
        members.push(name);
        updateMemberList();
        document.getElementById("grpwarning").style.visibility = 'hidden';
    }
    document.getElementById("addMemberContainer").innerHTML = ""; // Clear input field
    document.getElementById("add").style.visibility = 'visible';
}

function updateMemberList() {
    const list = document.getElementById("membersList");
    list.innerHTML = "";
    members.forEach((member, index) => {
        const memberDiv = document.createElement("div");
        memberDiv.className = "member";
        memberDiv.innerHTML = ` ${member}`;
        //create a remove button
        const removebutton = document.createElement("button");
        removebutton.innerText = "X";
        removebutton.id = "removeMember" + index;
        removebutton.className = "delete-btn";
        removebutton.addEventListener('pointerdown', () => removeMember(index));
        memberDiv.appendChild(removebutton);
        list.appendChild(memberDiv);
        const idname = 'removeMember' + index;
        
    });
}

function removeMember(index) {
    members.splice(index, 1);
    updateMemberList();
}

function togglePassword() {
    const passwordField = document.getElementsByClassName("groupPassword");
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
        document.getElementById("grpwarning").style.visibility = 'visible';
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

function goBackToCreateGroup() {
    document.getElementById("groupOwnerUI").style.display = "none";
    document.getElementById("createGroupUI").style.display = "block";
}

document.getElementById('nxtstep').addEventListener('pointerdown', switchToGroupOwnerUI);
var btcg = document.getElementsByClassName('backtocg');
for (let i = 0; i < btcg.length; i++) {
    btcg[i].addEventListener('pointerdown', goBackToCreateGroup);
}

document.getElementById('add').addEventListener('pointerdown', showAddMemberInput);

var et = document.getElementsByClassName('eyeToggle');
for (let i = 0; i < et.length; i++) {
    et[i].addEventListener('pointerdown', togglePassword);
}