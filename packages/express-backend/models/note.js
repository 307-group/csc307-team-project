import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, default: "" },
    labelId: { type: String, default: null },
    imageUrl: { type: String, default: "" },
    imagePublicId: { type: String, default: null },
    userId: { type: String, required: true },
    shareId: { type: String, unique: true, sparse: true },
    isShared: {
      type: Boolean,
      default: false,
    },
    syncedFromShareId: {
      type: String,
      default: null,
    },

    syncedFromNoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      default: null,
    },

    isSyncedCopy: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Note", noteSchema);
