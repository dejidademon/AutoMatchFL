const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Pre-populated list of names
let names = [
  "Jordan Polk", "Jeff Jacobs", "Doug Guyer", "Paul Alshooler", "Justin Silver",
  "David Weissman", "Katya Kohen", "Carla McDonald", "Rishi Sharma", "Greg Stemler",
  "John Morgan", "John Sarkisian", "Craig Foxhoven", "Ivan Khymych", "Bill Donahue",
  "Julian Jung", "Charlotte Schodowski", "Bridget Pansini", "Yogesh Patel", "Moy Aras",
  "Hattie Gilpin", "Nate Herrington", "Michael Lewis", "Sid Banthiya", "Cyrus Sadeghian",
  "Vasu Kulkarni", "Evan Einstein", "Sumeet Shah", "Thibault Vanvincq", "Nate Swanson",
  "Ali Guthy", "Ian Hall", "Julia Kelly", "Chip Longenecker", "Andrew Ferrero",
  "John Copses", "Mike McKeon", "Riley Chang"
];

// Track matched pairs to avoid duplicates
let matchedPairs = [];

// Generate all possible unique pairs (avoiding self-matching)
function generatePossibleMatches() {
  let availableMatches = [];
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      availableMatches.push([names[i], names[j]]);
    }
  }
  return availableMatches;
}

// Endpoint to get all names
app.get('/names', (req, res) => {
  res.json(names);
});

// Endpoint to add a name
app.post('/add-name', (req, res) => {
  const { name } = req.body;
  if (name && name.trim()) {
    names.push(name.trim());
    res.status(200).json({ message: 'Name added successfully' });
  } else {
    res.status(400).json({ message: 'Name cannot be empty' });
  }
});

// Endpoint to generate a unique match (not already matched and not self-matching)
app.post('/generate-match', (req, res) => {
  const possibleMatches = generatePossibleMatches();
  
  // Filter out matches that have already been made
  const availableMatches = possibleMatches.filter(match => {
    return !matchedPairs.some(existingPair => {
      return (existingPair[0] === match[0] && existingPair[1] === match[1]) ||
             (existingPair[0] === match[1] && existingPair[1] === match[0]);
    });
  });

  if (availableMatches.length === 0) {
    return res.status(400).json({ message: 'No more available matches' });
  }

  // Randomly pick one match
  const randomMatch = availableMatches[Math.floor(Math.random() * availableMatches.length)];
  res.json(randomMatch);
});

// Endpoint to approve or deny a match
app.post('/match-decision', (req, res) => {
  const { match, approve } = req.body;

  if (!match || !match[0] || !match[1]) {
    return res.status(400).json({ message: 'Invalid match data' });
  }

  if (approve) {
    // Add the approved match to the matched pairs
    matchedPairs.push(match);
    res.status(200).json({ message: 'Match approved' });
  } else {
    // Denied match, put it back in the pool
    // Re-generate all matches, since we don’t need to track denied ones
    res.status(200).json({ message: 'Match denied, back in the pool' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
