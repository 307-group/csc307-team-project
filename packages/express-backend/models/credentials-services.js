// models/note-services.js
import Credential from "./credential.js";

async function getCredential(username) {
  try {
    return await Credential.findOne({ username });
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function addCredential({username, hashedPassword}) {
  try {
    const newCredential = new Credential({ username, hashedPassword });
    return await newCredential.save();
  } catch (error) {
    console.log(error);
    return false;
  }
}


export default { addCredential, getCredential };
