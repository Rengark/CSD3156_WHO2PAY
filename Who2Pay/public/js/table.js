const membersTable = document.getElementById('members-table').querySelector('tbody');
const addMemberBtn = document.getElementById('add-member-btn');
const memberNameInput = document.getElementById('member-name');

addMemberBtn.addEventListener('click', () => {
  const name = memberNameInput.value.trim();

  if (name) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${name}</td>
      <td><button type="button" class="remove-member-btn">X</button></td>
    `;
    membersTable.appendChild(row);

    // Clear input
    memberNameInput.value = '';

    // Add event listener to remove button
    row.querySelector('.remove-member-btn').addEventListener('click', () => {
      row.remove();
    });
  } else {
    alert('Please enter a name.');
  }
});