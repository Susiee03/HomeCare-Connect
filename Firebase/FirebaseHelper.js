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

      // 使用 setDoc 并指定 ID 来创建 acceptedTasks 文档
      const acceptedTaskRef = doc(db, "acceptedTasks", taskId);
      await setDoc(acceptedTaskRef, acceptedTaskInfo);
      console.log("Accepted task document written with ID: ", taskId);
      
      await updateDoc(taskRef, { status: 'in progress', updatedAt: new Date() });
      console.log("Published task status updated to 'in progress'");
    } else {
      console.log("No such document in published tasks!");
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
  const publishedTaskRef = doc(db, "publishedTasks", taskId);
  const acceptedTaskRef = doc(db, "acceptedTasks", taskId);

  try {
    await deleteDoc(publishedTaskRef);
    console.log("Task deleted from published tasks with ID:", taskId);

    const acceptedTaskSnap = await getDoc(acceptedTaskRef);
    if (acceptedTaskSnap.exists()) {
      await deleteDoc(acceptedTaskRef);
      console.log("Task also deleted from accepted tasks with ID:", taskId);
    } else {
      console.log("No matching task in accepted tasks to delete for ID:", taskId);
    }
  } catch (err) {
    console.error("Error deleting task:", err);
  }
}


// User finishes an accepted task
export async function finishTask(taskId) {
  const acceptedTaskRef = doc(db, "acceptedTasks", taskId);
  const publishedTaskRef = doc(db, "publishedTasks", taskId);
  console.log(acceptedTaskRef)
  console.log(publishedTaskRef)

  try {
    // Check and get the accepted task data
    const acceptedTaskSnap = await getDoc(acceptedTaskRef);
    console.log(acceptedTaskSnap)
    if (!acceptedTaskSnap.exists()) {
      console.log("No such task in accepted tasks!");
      throw new Error("No such task in accepted tasks!");
    }

    // Move task to history with status 'closed'
    const taskData = acceptedTaskSnap.data();
    await addDoc(collection(db, "taskHistory"), {
      ...taskData,
      finishedAt: new Date(),
      status: 'closed',
    });

    console.log("Task moved to task history with ID: ", taskId);

    // Delete task from accepted tasks
    await deleteDoc(acceptedTaskRef);
    console.log("Task removed from accepted tasks with ID: ", taskId);

    // Update and remove the published task
    await updateDoc(publishedTaskRef, { status: 'closed', updatedAt: new Date() });
    await deleteDoc(publishedTaskRef);
    console.log("Published task status updated to 'closed' and removed with ID: ", taskId);
  } catch (err) {
    console.error("Error finishing task", err);
    throw err; // Optionally re-throw the error if you need to handle it elsewhere
  }
}
