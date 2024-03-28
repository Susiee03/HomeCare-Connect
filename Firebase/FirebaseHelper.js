import {
  collection,
  doc,
  addDoc,
  query,
  where,
  deleteDoc,
  updateDoc,
  setDoc,
  getDoc,
  getDocs,
  } from "firebase/firestore";
import { db, auth} from "./FirebaseSetup";

// user published task
export async function publishTask(taskFormData) {
  const task = {
    ...taskFormData,
    createdAt: new Date(), 
    updatedAt: new Date(), 
    publisherId: auth.currentUser.uid, 
    status: 'open', 
  };
  
  try {
    const docRef = await addDoc(collection(db, "publishedTasks"), task);
    console.log("Published task document written with ID: ", docRef.id);
  } catch (err) {
    console.error("Error publishing task to DB", err);
  }
}

// User accepts tasks
export async function acceptTask(taskId) {
  const acceptTaskInfo = {
      taskId: taskId, 
      acceptorId: auth.currentUser.uid, 
      acceptedAt: new Date(), 
      status: 'in progress', 
  };
  
  try {
      const docRef = await addDoc(collection(db, "acceptedTasks"), acceptTaskInfo);
      console.log("Accepted task document written with ID: ", docRef.id);
      
      const taskRef = doc(db, "publishedTasks", taskId);
      await updateDoc(taskRef, { status: 'in progress', updatedAt: new Date() });
      console.log("Published task status updated to 'in progress'");
  } catch (err) {
      console.error("Error accepting task", err);
  }
}