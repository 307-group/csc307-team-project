// models/note-services.js
import Note from "./note.js";
import crypto from "crypto";

async function getNotes(userId) {
  return await Note.find({ userId }).sort({ createdAt: -1 }); // newest first
}

async function getNoteById(id, userId) {
  try {
    if (userId) {
      return await Note.findOne({ _id: id, userId });
    }

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

async function enableShare(id, userId) {
  try {
    const shareId = crypto.randomBytes(8).toString("hex");

    return await Note.findOneAndUpdate(
      { _id: id, userId },
      {
        isShared: true,
        shareId,
      },
      { new: true },
    );
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function getNoteByShareId(shareId) {
  try {
    return await Note.findOne({
      shareId,
      isShared: true,
    });
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function updateSharedNote(shareId, updatedFields) {
  try {
    return await Note.findOneAndUpdate(
      {
        shareId,
        isShared: true,
      },
      updatedFields,
      { returnDocument: "after" },
    );
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function updateSyncedCopies(shareId, updatedFields) {
  try {
    return await Note.updateMany(
      {
        syncedFromShareId: shareId,
        isSyncedCopy: true,
      },
      updatedFields,
    );
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function saveSyncedCopy(sharedNote, userId) {
  try {
    const existingCopy = await Note.findOne({
      userId,
      syncedFromShareId: sharedNote.shareId,
      isSyncedCopy: true,
    });

    if (existingCopy) {
      return existingCopy;
    }

    const newNote = new Note({
      title: sharedNote.title || "Untitled Note",
      body: sharedNote.body || "",
      labelId: null,
      imageUrl: sharedNote.imageUrl || null,
      imagePublicId: null,
      userId,
      syncedFromShareId: sharedNote.shareId,
      syncedFromNoteId: sharedNote._id,
      isSyncedCopy: true,
    });

    return await newNote.save();
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export default {
  getNotes,
  getNoteById,
  addNote,
  deleteNote,
  updateNote,
  enableShare,
  getNoteByShareId,
  updateSharedNote,
  updateSyncedCopies,
  saveSyncedCopy,
};
