/** @format */

// A simple notekeeping app
const express = require("express");
const app = express();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

app.use(express.json());

// Fetch notes
let fetchNotes = () => {
  try {
    let notesString = fs.readFileSync("notes.json", { encoding: "utf-8" });
    return JSON.parse(notesString);
  } catch (error) {
    return [];
  }
};

// Save notes
let saveNotes = notes => {
  // Save notes
  fs.writeFileSync("notes.json", JSON.stringify(notes));
};

// Add note route
app.post("/notes/", async (req, res) => {
  let notes = fetchNotes();
  const { title, text } = req.body;

  const newNote = {
    title,
    text,
    id: uuidv4()
  };

  // Append note to notes
  notes.push(newNote);

  saveNotes(notes);

  // Send back all notes
  res.send(notes);
});

// Get single note route
app.get("/notes/:id", (req, res) => {
  let notes = fetchNotes();
  const id = req.params.id;

  let note = notes.filter(note => note.id === id);
  res.send(note);
});

// Get all notes
app.get("/notes", (req, res) => {
  let notes = fetchNotes();
  res.send(notes);
});

// Delete note route
app.delete("/notes/:id", (req, res) => {
  let notes = fetchNotes();
  const id = req.params.id;

  notes = notes.filter(note => note.id !== id);

  saveNotes(notes);

  res.send(notes);
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`App listening at port: ${PORT}`);
});
