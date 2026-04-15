import { db } from "./firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";

// generate T + 3 digits
export const generateTaskId = () => {
  const random = Math.floor(100 + Math.random() * 900);
  return `T${random}`;
};

// create task
export const createTask = async (projectId, taskData) => {
  const taskRef = collection(db, "projects", projectId, "tasks"); // create new database "tasks" inside database "projects"

  const newTask = {
    taskId: generateTaskId(),
    name: taskData.name,
    description: taskData.description,
    createdAt: serverTimestamp(),
    startDate: taskData.startDate,
    deadline: taskData.deadline,
    status: "Pending",
  };

  await addDoc(taskRef, newTask);
};

// update task
export const updateTask = async (projectId, taskId, updateData) => {
  const taskRef = doc(db, "projects", projectId, "tasks", taskId); // this projectId from useParams

  await updateDoc(taskRef, updateData);
};