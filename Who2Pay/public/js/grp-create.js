let members = [];
//empty owner to be set later
let owner = "";
let groupName = null;
let groupPassword = null;
let memberPassword = null;

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
        document.getElementById("grpwarning").style.display = 'none';
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
        removebutton.style.cursor = "pointer";
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

function switchToGroupOwnerUI() {
    if(members.length === 0) {
        document.getElementById("grpwarning").style.display = "block";
        return;
    }

    document.getElementById("createGroupUI").style.display = "none";
    document.getElementById("groupOwnerUI").style.display = "block";

    groupName = document.getElementById('groupname').value;
    groupPassword = document.getElementById('grouppassword').value;
    memberPassword = document.getElementById('makepassword').checked ? 'on' : 'off';
    
    const nameDropdown = document.getElementById("ownername");
    nameDropdown.innerHTML = "";

    const d = document.createElement("option");
    d.value = "none";
    d.textContent = "Select a user";
    nameDropdown.appendChild(d);

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



var nxtstep = document.getElementById('nxtstep')
if (nxtstep) {
    nxtstep.addEventListener('pointerdown', switchToGroupOwnerUI);
}


var btcg = document.getElementsByClassName('backtocg');
if(btcg.length > 0) {
    for (let i = 0; i < btcg.length; i++) {
        btcg[i].addEventListener('pointerdown', goBackToCreateGroup);
    }
}


const addButton = document.getElementById('add');
if (addButton) {
    addButton.addEventListener('pointerdown', showAddMemberInput);
}

var et = document.getElementsByClassName('eyeToggle');
if(et.length > 0) {
    for (let i = 0; i < et.length; i++) {
        et[i].addEventListener('pointerdown', togglePassword);
    }
}


//@junwei this is all the values need to be saved in the db after submit is clicked
document.addEventListener('DOMContentLoaded', function() {
    
    const createGroupForm = document.getElementById('set-owner-form');
    if (createGroupForm) 
    {
        createGroupForm.addEventListener('submit', async function(e) 
        {
            try{
                e.preventDefault();
                const nameDropdown = document.getElementById("ownername");
                owner = nameDropdown.options[nameDropdown.selectedIndex].value;
                const ownerpassword = document.getElementById("ownerpassword").value.trim();
                const parsedMembers = members.map(member => member.trim()).filter(member => member !== '');
                //member is the array for getting the list of people initially in the group
                const response = await fetch('/createGroup/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ groupName, groupPassword, memberPassword, members_table: parsedMembers })
                })
                
                if (!response.ok) {
                    const data = await response.json();
                    const messageDiv = document.getElementById('message');
                    if (messageDiv) 
                    {   
                        messageDiv.textContent = data.message;
                        messageDiv.className = 'error';
                    }
                    else
                    {
                        console.error('Message div not found');
                        console.log(data.message);
                        console.log(groupName, groupPassword, memberPassword);
                    }
                    return;
                }

                

                const response2 = await fetch('/createGroup/registerOwner', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: owner, password: ownerpassword })
                })
                const data2 = await response2.json();
                if (response2.ok) {
                    
                    // const messageDiv = document.getElementById('message');
                    //     messageDiv.textContent = data2.message;
                    //     messageDiv.className = 'success';
                        

                        // cookies have been set for authentication, now we need to set nothing for the owner

                        // Redirect to registration page after successful group creation
                        setTimeout(() => {
                            window.location.href = '/expense-list';
                        }, 2000);
                }
                else {
                    const messageDiv = document.getElementById('message');
                    if (messageDiv) {
                        messageDiv.textContent = data2.message;
                        messageDiv.className = 'error';
                    }
                    else
                    {
                        console.error('Message div not found');
                        console.log(data2.message);
                        console.log(owner, ownerpassword);
                    }
                }
            }
            catch (error) {
                console.error('Error:', error);
                const messageDiv = document.getElementById('message');
                messageDiv.textContent = 'An error occurred. Please try again.';
                messageDiv.className = 'error';
            }
        });
    }
});