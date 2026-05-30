// models/note-services.js
import Note from "./note.js";

async function getNotes(userId) {
  return await Note.find({ userId }).sort({ createdAt: -1 }); // newest first
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

async function updateNote(id, updatedFields) {
  try {
    return await Note.findByIdAndUpdate(id, updatedFields, { new: true });
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export default { getNotes, getNoteById, addNote, deleteNote, updateNote };
