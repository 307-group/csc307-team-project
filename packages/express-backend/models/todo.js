import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  completed: { type: Boolean, default: false },
});

export default mongoose.model("Todo", todoSchema);
