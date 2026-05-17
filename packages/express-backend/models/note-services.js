// models/note-services.js
import Note from "./note.js";

async function getNotes() {
  return await Note.find();
}

async function getNoteById(id) {
  try {
    return await Note.findById(id);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function addNote(note) {
  try {
    const newNote = new Note(note);
    return await newNote.save();
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function deleteNote(id) {
  try {
    return await Note.findByIdAndDelete(id);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export default { getNotes, getNoteById, addNote, deleteNote };