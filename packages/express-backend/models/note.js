import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, default: "" },
    labelId: { type: String, default: null },
    imageUrl: { type: String, default: "" },
    imagePublicId: { type: String, default: null },
  },
  { timestamps: true },
);

export default mongoose.model("Note", noteSchema);
