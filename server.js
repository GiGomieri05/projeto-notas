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
app.get('/api/notes', (req, res) => {
  const notes = readNotes();
  res.json(notes);
});

// POST endpoint to add a new note
app.post('/api/notes', (req, res) => {
  const notes = readNotes();

  const newNote = {
    id: Date.now().toString(),
    title: req.body.title,
    content: req.body.content,
  };

  notes.push(newNote);
  saveNotes(notes);

  res.json(newNote);
});

// PUT endpoint to update a note
app.put('/api/notes/:id', (req, res) => {
  const notes = readNotes();

  const noteId = notes.findIndex(note => note.id === req.params.id);
  if (noteId < 0) {
    return res.status(404).json({ error: 'Note not found' });
  }

  notes[noteId].title = req.body.title;
  notes[noteId].content = req.body.content;

  saveNotes(notes);
  res.json(notes[noteId]);
});

// DELETE endpoint to delete a note
app.delete('/api/notes/:id', (req, res) => {
  const notes = readNotes();

  const newNotes = notes.filter(note => note.id !== req.params.id);

  saveNotes(newNotes);

  res.json({ message: 'Note deleted' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
