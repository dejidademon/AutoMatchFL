// filepath: /c:/Users/yoooo/Desktop/All Of My Coding Projects/AutoMatch/functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.generateMatch = functions.https.onCall(async (data, context) => {
  const namesSnapshot = await db.collection('names').get();
  const names = namesSnapshot.docs.map(doc => doc.id);
  let availableMatches = [];
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      availableMatches.push([names[i], names[j]]);
    }
  }

  const matchesSnapshot = await db.collection('matches').get();
  const existingMatches = matchesSnapshot.docs.map(doc => doc.id);

  const possibleMatches = availableMatches.filter(match => {
    const matchId = `${match[0]}-${match[1]}`;
    return !existingMatches.includes(matchId);
  });

  if (possibleMatches.length === 0) {
    return { message: 'No available matches' };
  }

  const randomMatch = possibleMatches[Math.floor(Math.random() * possibleMatches.length)];
  return { match: randomMatch };
});