let grpowner = "John Doe"; // Example group owner
let grpname = "test";


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


function JoinGroup()
{
    const groupName = document.getElementById("groupName").value;
    const groupPassword = document.getElementById("groupPassword").value;
    
    //need to get the database, and check for grp name and grp password here
    //using the hardcoded grpname and password for now
    if (groupName === grpname && groupPassword === "123") 
    {
        document.getElementById("grpwarning").style.display = "none";
        //load member login page the same as clicking a button w href load /member-login
        //authenticate here @junwei
        window.location.href = "/member-login";
    
    } else 
    {
        document.getElementById("grpwarning").style.display = "block";
    }
}

var joingrp = document.getElementById('join')
if (joingrp) {
    joingrp.addEventListener('pointerdown', JoinGroup);
}

