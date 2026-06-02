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

async function deleteNote(id, userId) {
  try {
    return await Note.findOneAndDelete({ _id: id, userId });
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function updateNote(id, userId, updatedFields) {
  try {
    return await Note.findOneAndUpdate({ _id: id, userId }, updatedFields, {
      returnDocument: "after",
    });
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export default { getNotes, getNoteById, addNote, deleteNote, updateNote };
