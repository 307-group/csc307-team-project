// models/note-services.js
import Label from "./label.js";

async function getLabels(userId) {
  return await Label.find({ userId });
}

async function addLabel(label, userId) {
  try {
    const newLabel = new Label({ ...label, userId });
    return await newLabel.save();
  } catch (error) {
    console.log(error);
    return false;
  }
}
async function deleteLabel(id, userId) {
  try {
    return await Label.findByIdAndDelete({ _id: id, userId });
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export default { getLabels, addLabel, deleteLabel };
