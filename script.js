const apiUrl = 'http://localhost:3000'; // Backend URL

// Function to fetch and update names list
async function fetchNames() {
  try {
    const response = await fetch(`${apiUrl}/names`);
    const data = await response.json();
    const namesList = document.getElementById('namesList');
    namesList.innerHTML = ''; // Clear the current list
    data.forEach(name => {
      const li = document.createElement('li');
      li.textContent = name;
      namesList.appendChild(li);
    });
  } catch (error) {
    console.error('Error fetching names:', error);
  }
}

// Add Name Event Listener
document.getElementById('addName').addEventListener('click', async () => {
  const nameInput = document.getElementById('nameInput').value.trim();
  
  if (nameInput === '') {
    alert("Please enter a valid name.");
    return;
  }

  try {
    await fetch(`${apiUrl}/add-name`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nameInput }),
    });
    document.getElementById('nameInput').value = ''; // Clear input field
    fetchNames(); // Refresh the names list
  } catch (error) {
    console.error('Error adding name:', error);
  }
});

// Generate Match Event Listener
document.getElementById('generateMatch').addEventListener('click', async () => {
  try {
    const response = await fetch(`${apiUrl}/generate-match`, { method: 'POST' });
    const match = await response.json();
    if (match.message) {
      alert(match.message); // No matches available
    } else {
      document.getElementById('matchResult').textContent = `Match: ${match[0]} & ${match[1]}`;
      // Show approval options
      document.getElementById('approveButtons').style.display = 'block';
      // Save the match for approval/denial
      window.currentMatch = match;
    }
  } catch (error) {
    console.error('Error generating match:', error);
  }
});

// Approve the match
document.getElementById('approveMatch').addEventListener('click', async () => {
  if (window.currentMatch) {
    try {
      await fetch(`${apiUrl}/match-decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ match: window.currentMatch, approve: true }),
      });
      document.getElementById('matchResult').textContent = `Match approved: ${window.currentMatch[0]} & ${window.currentMatch[1]}`;
      document.getElementById('approveButtons').style.display = 'none';
    } catch (error) {
      console.error('Error approving match:', error);
    }
  }
});

// Deny the match
document.getElementById('denyMatch').addEventListener('click', async () => {
  if (window.currentMatch) {
    try {
      await fetch(`${apiUrl}/match-decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ match: window.currentMatch, approve: false }),
      });
      document.getElementById('matchResult').textContent = `Match denied, back in the pool: ${window.currentMatch[0]} & ${window.currentMatch[1]}`;
      document.getElementById('approveButtons').style.display = 'none';
    } catch (error) {
      console.error('Error denying match:', error);
    }
  }
});

// Fetch and display names on page load
fetchNames();
