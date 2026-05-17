import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, default: "" },
});

export default mongoose.model("Note", noteSchema);
