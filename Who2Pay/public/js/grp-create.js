let members = [];

function showAddMemberInput() {
    const container = document.getElementById("addMemberContainer");
    container.innerHTML = `
        <input type="text" id="newMemberName" placeholder="Enter member name">
        <button id="confirmMember">Confirm</button>
    `;
    document.getElementById('confirmMember').addEventListener('pointerdown', confirmMember);
}

function confirmMember() {
    const input = document.getElementById("newMemberName");
    const name = input.value.trim();
    if (name && !members.includes(name)) {
        members.push(name);
        updateMemberList();
    }
    document.getElementById("addMemberContainer").innerHTML = ""; // Clear input field
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
    const passwordField = document.getElementById("groupPassword");
    passwordField.type = passwordField.type === "password" ? "text" : "password";
    //change icon from 🐵 to 🙈
    const passbuttontext = document.getElementById("eyeToggle");
    passbuttontext.innerText = passwordField.type === "password" ? "🙈" : "🐵";
}

// Event listener for save button
document.getElementById('eyeToggle').addEventListener('pointerdown', togglePassword);
document.getElementById('add').addEventListener('pointerdown', showAddMemberInput);
