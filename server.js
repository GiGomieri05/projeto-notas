// Imports Express, body-parser, and FS
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;
const FILE = 'data.json';

// Allows receive JSON
app.use(bodyParser.json());

// Free external access (CORS)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Function to read the file
function readNotes() {
  try {
    const data = fs.readFileSync(FILE);
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading file:', err);
    return [];
  }
}

// Function to save the file
function saveNotes(notes) {
  try {
    fs.writeFileSync(FILE, JSON.stringify(notes, null, 2));
  } catch (err) {
    console.error('Error writing file:', err);
  }
}

// GET endpoint to retrieve all notes
app.get('api/notes', (req, res) => {
  const notes = readNotes();
  res.json(notes);
});
