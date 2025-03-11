import { db } from './index.html';
import { collection, getDocs, onSnapshot, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

async function fetchNames() {
  try {
    const namesSnapshot = await getDocs(collection(db, 'names'));
    const namesList1 = document.getElementById('namesList1');
    const namesList2 = document.getElementById('namesList2');
    namesList1.innerHTML = '';
    namesList2.innerHTML = '';
    namesSnapshot.forEach((doc, index) => {
      const li = document.createElement('li');
      li.textContent = doc.id;
      if (index % 2 === 0) {
        namesList1.appendChild(li);
      } else {
        namesList2.appendChild(li);
      }
    });
  } catch (error) {
    console.error('Error fetching names:', error);
  }
}

async function fetchMatches() {
  try {
    const matchesSnapshot = await getDocs(collection(db, 'matches'));
    const matchesList = document.getElementById('matchesList');
    matchesList.innerHTML = '';
    matchesSnapshot.forEach(doc => {
      const match = doc.data().match;
      const li = document.createElement('li');
      li.textContent = `${match[0]} and ${match[1]}`;
      matchesList.appendChild(li);
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
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
    await setDoc(doc(db, 'names', nameInput), { name: nameInput });
    document.getElementById('nameInput').value = ''; // Clear the input field
    fetchNames(); // Refresh the list of names
  } catch (error) {
    console.error('Error adding name:', error);
  }
});

// Generate Match Event Listener
document.getElementById('generateMatch').addEventListener('click', async () => {
  try {
    const namesSnapshot = await getDocs(collection(db, 'names'));
    const names = namesSnapshot.docs.map(doc => doc.id);
    let availableMatches = [];
    for (let i = 0; i < names.length; i++) {
      for (let j = i + 1; j < names.length; j++) {
        availableMatches.push([names[i], names[j]]);
      }
    }

    const matchesSnapshot = await getDocs(collection(db, 'matches'));
    const existingMatches = matchesSnapshot.docs.map(doc => doc.id);

    const possibleMatches = availableMatches.filter(match => {
      const matchId = `${match[0]}-${match[1]}`;
      return !existingMatches.includes(matchId);
    });

    if (possibleMatches.length === 0) {
      document.getElementById('matchResult').innerHTML = 'No available matches';
      return;
    }

    const randomMatch = possibleMatches[Math.floor(Math.random() * possibleMatches.length)];
    const matchResult = document.getElementById('matchResult');
    matchResult.innerHTML = `Match: ${randomMatch[0]} and ${randomMatch[1]}
      <button id="acceptMatch">Accept</button>
      <button id="declineMatch">Decline</button>`;
    
    document.getElementById('acceptMatch').addEventListener('click', async () => {
      try {
        await setDoc(doc(db, 'matches', `${randomMatch[0]}-${randomMatch[1]}`), { match: randomMatch });
        matchResult.innerHTML = 'Match accepted!';
        fetchMatches(); // Refresh the list of matches
      } catch (error) {
        console.error('Error accepting match:', error);
      }
    });

    document.getElementById('declineMatch').addEventListener('click', () => {
      matchResult.innerHTML = 'Match declined!';
    });
  } catch (error) {
    console.error('Error generating match:', error);
  }
});

// Fetch names and matches on page load
fetchNames();
fetchMatches();
runThis();