import { doc, getDoc, onSnapshot } from "firebase/firestore"
import { db } from "./firebase"

// get user by uid
export const getUserData = async (usid) => {
  try {
    const useRef = doc(db, "users", usid);
    const snap = await getDoc(useRef);

    if (!snap.exists()) {
      throw new Error("User not found");
    }
    return snap.data();
  } catch(err) {
    console.error(err);
    throw err;
  }
};

// realtime image change
export const subscribeUserData = (uid, callback) => {
  const userRef = doc(db, "users", uid);

  return onSnapshot(userRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data());
    }
  });
};

