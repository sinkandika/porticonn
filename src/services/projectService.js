import { 
  addDoc, 
  collection, 
  serverTimestamp, 
  doc, 
  getDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  arrayUnion, 
  deleteDoc 
} from "firebase/firestore";
import { db } from "./firebase";

// generate invite code
export const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 8);
};

// join project by invite code 
export const joinProjectByCode = async (inviteCode, userId ) => {
  // find project
  const q = query(
    collection(db, "projects"),
    where("inviteCode", "==", inviteCode)
  );

  const querySnap = await getDocs(q);
  if (querySnap.empty) {
    throw new Error ("Invalid Invite code");
  }

  // prevent re joining
  const projectDoc = querySnap.docs[0];

  if (projectDoc.data().members.includes(userId)) {
    throw new Error("Already joined this project");
  }

  // add user to be member 
  const dbProjectId = projectDoc.id; 
  
  const projectRef = doc(db, "projects", dbProjectId);

  await updateDoc(projectRef, {
    members: arrayUnion(userId), //array union prevent from duplicate user.uid firebase
  });

  return dbProjectId;
};

// create project 
export const createProject = async (projectData) => {
  const docRef = await addDoc(collection(db, "projects"), {
    ...projectData,
    createdAt: serverTimestamp(), // get from firestore
  });

  return docRef.id;
};

// get project by id
export const getProjectById = async (getId) => {
  const docRef = doc(db, "projects", getId);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    return {
      id: snap.id,
      ...snap.data(),
    };
  } else {
    throw new Error("Project not found");
  }
};

// update project 
export const updateProject = async (projectId, updateData) => {
  const projectRef = doc(db, "projects", projectId);

  await updateDoc(projectRef, updateData);
};

// delete project
export const deleteProject = async (projectId) => {
  const projectRef = doc(db, "projects", projectId);
  await deleteDoc(projectRef);
};