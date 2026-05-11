// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

// notes data store
const notes = {
  notes_list: [
    {
      id: "note_001",
      title: "Welcome Note",
      body: "This is your first note!",
      updatedAt: Date.now(),
    },
  ],
};

app.use(cors());
app.use(express.json());

// random id generator
const generateId = () => {
  return Math.random().toString(36).substring(2, 7);
};

// find note by id
const findNoteById = (id) =>
  notes["notes_list"].find((note) => note["id"] === id);

// add note
const addNote = (note) => {
  notes["notes_list"].push(note);
  return note;
};

// delete note by id
const deleteNoteById = (id) => {
  const index = notes["notes_list"].findIndex((note) => note["id"] === id);
  if (index !== -1) {
    return notes["notes_list"].splice(index, 1);
  }
  return undefined;
};

// GET all notes
app.get("/notes", (req, res) => {
  res.send(notes);
});

// GET one note by id
app.get("/notes/:id", (req, res) => {
  const id = req.params["id"];
  let result = findNoteById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

// POST create a note
app.post("/notes", (req, res) => {
  const noteToAdd = req.body;
  noteToAdd["id"] = generateId();
  noteToAdd["updatedAt"] = Date.now();
  let result = addNote(noteToAdd);
  res.status(201).send(result);
});

// DELETE a note by id
app.delete("/notes/:id", (req, res) => {
  const id = req.params["id"];
  let delete_result = deleteNoteById(id);
  if (delete_result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(200).send(delete_result);
  }
});

// listen
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});