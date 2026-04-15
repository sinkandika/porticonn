import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth"
import { auth, db } from "./firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";


// Register
export const registerUser = async (name, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  // Update display name
  await updateProfile(user, {
    displayName: name,
  });

  // make new data to firestore users database
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name: name,
    email: email,
    photoURL: "", 
    createdAt: serverTimestamp(),
  });

  await signOut(auth);

  return user;
};

// Login
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  return userCredential.user;
};

// Logout
export const logoutUser = async () => {
  await signOut(auth);
};