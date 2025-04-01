document.addEventListener('DOMContentLoaded', function() {
    // check if user has created a group

    //checkGroupStatus();
    const createGroupForm = document.getElementById('create-group-form');
    
    if (createGroupForm) {
        createGroupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const groupName =  document.getElementById('group-name').value;
            const groupPassword = document.getElementById('group-password').value;
            const memberPassword = document.getElementById('member-password').checked ? 'on' : 'off';
            const membersTable = document.getElementById('members-table').querySelector('tbody');
            const members = Array.from(membersTable.querySelectorAll('tr')).map(row => {
                const name = row.querySelector('td').textContent.trim();
                return { name };
            });

            const messageDiv = document.getElementById('message');
            
            try {
                const response = await fetch('/createGroup/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ groupName, groupPassword, memberPassword, members_table: members })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    messageDiv.textContent = data.message;
                    messageDiv.className = 'success';
                    // Redirect to dashboard after successful group creation
                    setTimeout(() => {
                        window.location.href = '/register.html';
                    }, 2000);
                } else {
                    messageDiv.textContent = data.message;
                    messageDiv.className = 'error';
                }
            } catch (error) {
                messageDiv.textContent = 'An error occurred. Please try again.';
                messageDiv.className = 'error';
            }
        });
    }

    async function checkGroupStatus() {
        try {
            const response = await fetch('/createGroup/status');
            const data = await response.json();
            
            if (data.hasGroup) {
                // User has already created a group
                window.location.href = '/dashboard';
            }
        } catch (error) {
            console.error('Error checking group status:', error);
        }
    }
  });