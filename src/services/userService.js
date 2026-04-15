import { doc, getDoc } from "firebase/firestore"
import { db } from "./firebase";

// get user by id
export const getUserById = async (uids) => {
  try {
    const users = await Promise.all(
      uids.map(async (uid) => {
        const useRef = doc(db, "users", uid);
        const userSnap = await getDoc(useRef);

        if (userSnap.exists()) {
          return userSnap.data();
        } else {
          return null;
        }
      })
    );
    return users.filter(Boolean); // remove null
  } catch (err) {
    console.error(err);
    return [];
  }
};