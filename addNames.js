//initiale setup for the database
// This script adds a list of names to the Firestore database

const admin = require('./firebase'); // Import the Firebase admin instance

const db = admin.firestore();

const names = [
  "Jordan Polk",
  "Jeff Jacobs",
  "Doug Guyer",
  "Paul Alshooler",
  "Justin Silver",
  "David Weissman",
  "Katya Kohen",
  "Carla McDonald",
  "Rishi Sharma",
  "Greg Stemler",
  "John Morgan",
  "John Sarkisian",
  "Craig Foxhoven",
  "Ivan Khymych",
  "Bill Donahue",
  "Julian Jung",
  "Charlotte Schodowski",
  "Bridget Pansini",
  "Yogesh Patel",
  "Moy Aras",
  "Hattie Gilpin",
  "Nate Herrington",
  "Michael Lewis",
  "Sid Banthiya",
  "Emma Pratt",
  "Cyrus Sadeghian",
  "Vasu Kulkarni",
  "Evan Einstein",
  "Sumeet Shah",
  "Thibault Vanvincq",
  "Nate Swanson",
  "Ali Guthy",
  "Ian Hall",
  "Julia Kelly",
  "Chip Longenecker",
  "Andrew Ferrero",
  "John Copses",
  "Riley Chang"
];

async function addNames() {
  for (const name of names) {
    const nameTrimmed = name.trim();
    await db.collection('names').doc(nameTrimmed).set({ name: nameTrimmed });
    console.log(`Added: ${nameTrimmed}`);
  }
  console.log('All names added successfully');
}

addNames().catch(console.error);