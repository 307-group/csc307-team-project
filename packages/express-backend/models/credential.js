import mongoose from "mongoose";

const credSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
});

export default mongoose.model("Credential", credSchema);
