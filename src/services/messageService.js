import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "./firebase"

// create message
export const sendMessage = async (projectId, message) => {
  try {
    const messageRef = collection(db, "projects", projectId, "messages");

    await addDoc(messageRef, {
      text: message.text,
      senderId: message.senderId,
      senderName: message.senderName,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Error sending message", err);
  }
};