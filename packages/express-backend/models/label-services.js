// models/note-services.js
import Label from "./label.js";

async function getLabels() {
  return await Label.find();
}

async function addLabel(label) {
  try {
    const newLabel = new Label(label);
    return await newLabel.save();
  } catch (error) {
    console.log(error);
    return false;
  }
}
async function deleteLabel(id) {
    try {
    return await Label.findByIdAndDelete(id);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}
  
export default { getLabels, addLabel, deleteLabel };
