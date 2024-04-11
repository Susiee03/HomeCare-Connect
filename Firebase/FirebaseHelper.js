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
  try {
    const taskRef = doc(db, "publishedTasks", taskId);
    const taskSnapshot = await getDoc(taskRef);

    if (taskSnapshot.exists()) {
      const acceptedTaskInfo = {
        ...taskSnapshot.data(), 
        acceptorId: auth.currentUser.uid, 
        acceptedAt: new Date(), 
        status: 'in progress', 
      };
      

      const docRef = await addDoc(collection(db, "acceptedTasks"), acceptedTaskInfo);
      console.log("Accepted task document written with ID: ", docRef.id);
      
  
      await updateDoc(taskRef, { status: 'in progress', updatedAt: new Date() });
      console.log("Published task status updated to 'in progress'");
    } else {
      console.log("No such document!");
    }
  } catch (err) {
    console.error("Error accepting task", err);
  }
}

export async function updateTask(taskId, taskUpdates) {
  const taskRef = doc(db, "publishedTasks", taskId);

  try {
    await updateDoc(taskRef, {
      ...taskUpdates,
      updatedAt: new Date(), 
    });
    console.log("Task updated with ID: ", taskId);
  } catch (err) {
    console.error("Error updating task", err);
  }
}

export async function deleteTask(taskId) {
  const taskRef = doc(db, "publishedTasks", taskId);

  try {
    await deleteDoc(taskRef);
    console.log("Task deleted with ID: ", taskId);
  } catch (err) {
    console.error("Error deleting task", err);
  }
}

// User finishes an accepted task
export async function finishTask(taskId) {
  try {

    const acceptedTaskRef = doc(db, "acceptedTasks", taskId);
    const acceptedTaskSnap = await getDoc(acceptedTaskRef);

    if (acceptedTaskSnap.exists()) {

      await addDoc(collection(db, "taskHistory"), {
        ...acceptedTaskSnap.data(),
        finishedAt: new Date(), 
        status: 'completed', 
      });
      console.log("Task moved to task history with ID: ", taskId);

      await deleteDoc(acceptedTaskRef);
      console.log("Task removed from accepted tasks with ID: ", taskId);
    } else {
      console.log("No such task in accepted tasks!");
    }
  } catch (err) {
    console.error("Error finishing task", err);
  }
}
