const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
const admin = require('./firebase'); // Import the Firebase admin instance

const db = admin.firestore();
const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

async function generatePossibleMatches() {
  const namesSnapshot = await db.collection('names').get();
  const names = namesSnapshot.docs.map(doc => doc.id); // Use doc.id to get the name
  let availableMatches = [];
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      availableMatches.push([names[i], names[j]]);
    }
  }
  return availableMatches;
}

// Endpoint to get all names
app.get('/names', async (req, res) => {
  const namesSnapshot = await db.collection('names').get();
  const names = namesSnapshot.docs.map(doc => doc.id); // Use doc.id to get the name
  res.json(names);
});

// Endpoint to add a name
app.post('/add-name', async (req, res) => {
  const { name } = req.body;
  if (name && name.trim()) {
    const nameTrimmed = name.trim();
    await db.collection('names').doc(nameTrimmed).set({ name: nameTrimmed });
    res.status(200).json({ message: 'Name added successfully' });
  } else {
    res.status(400).json({ message: 'Invalid name' });
  }
});

// Endpoint to generate a match
app.get('/generate-match', async (req, res) => {
  const possibleMatches = await generatePossibleMatches();
  const matchesSnapshot = await db.collection('matches').get();
  const existingMatches = matchesSnapshot.docs.map(doc => doc.id);

  const availableMatches = possibleMatches.filter(match => {
    const matchId = `${match[0]}-${match[1]}`;
    return !existingMatches.includes(matchId);
  });

  if (availableMatches.length === 0) {
    return res.status(200).json({ message: 'No available matches' });
  }

  const randomMatch = availableMatches[Math.floor(Math.random() * availableMatches.length)];
  res.status(200).json({ match: randomMatch });
});

// Endpoint to accept a match
app.post('/accept-match', async (req, res) => {
  const { match } = req.body;
  const matchId = `${match[0]}-${match[1]}`;
  await db.collection('matches').doc(matchId).set({ match });
  res.status(200).json({ message: 'Match accepted' });
});

// Endpoint to get all matches
app.get('/matches', async (req, res) => {
  const matchesSnapshot = await db.collection('matches').get();
  const matches = matchesSnapshot.docs.map(doc => doc.data().match);
  res.json(matches);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});