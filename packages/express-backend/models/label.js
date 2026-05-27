import mongoose from "mongoose";

const labelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, default: "" },
});

export default mongoose.model("Label", labelSchema);
