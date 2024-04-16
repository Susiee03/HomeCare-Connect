import {
    collection,
    addDoc
  } from "firebase/firestore";
  import { db } from "./FirebaseSetup";

  export async function writeReviewToDB(taskId, reviewData) {
    try {
      const taskRef = collection(db, "taskHistory", taskId, "reviews");
      const docRef = await addDoc(taskRef, reviewData);
      return { success: true, docId: docRef.id };
    } catch (error) {
      console.error("Error adding document: ", error);
      return { success: false, error: error };
    }
  }