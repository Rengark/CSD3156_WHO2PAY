
let grpname = "test"; // -> get from db
let grppassword = "123"; // -get from db

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
    
}

document.addEventListener('DOMContentLoaded', function()  {
    const joinGroupForm = document.getElementById("join-group-form");
   
    if (joinGroupForm)  // Ensure the form exists
    {
    //need to get the database, and check for grp name and grp password here
        joinGroupForm.addEventListener('submit', async function(e) 
        {
            e.preventDefault();
            try 
            {
                const groupName = document.getElementById("groupname").value;
                const groupPassword = document.getElementById("grouppassword").value;
                //load member login page the same as clicking a button w href load /member-login
                //authenticate here @junwei
                //window.location.href = "/member-login";
                const response = await fetch('/auth/checkGroupValid', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ groupName, groupPassword })
                });
                const data = await response.json();

                if (response.ok) 
                {
                    // log to console
                    console.log(data.message);
                    //redirect to member login page
                    document.getElementById("grpwarning").style.display = "none";
                    
                    
                    //redirect to member login page
                    // delay for 2 seconds before redirecting
                    setTimeout(() => {
                        window.location.href = "/member-login"; //change to groupId from db
                    }, 2000);
                } 
                else 
                {
                    document.getElementById("grpwarning").style.display = "block";
                    document.getElementById("grpwarning").innerText = data.message;
                }    
            } 
            catch (error) 
            {
                document.getElementById("grpwarning").style.display = "block";
                document.getElementById("grpwarning").innerText = "An error occurred. Please try again." + error;
            }
        });
    }
});

