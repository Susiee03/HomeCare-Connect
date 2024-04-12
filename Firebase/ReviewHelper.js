import {
    collection,
    addDoc
  } from "firebase/firestore";
  import { db } from "./FirebaseSetup";

  export async function writeReviewToDB(data) {
    try {
        const docRef = await addDoc(collection(db, "Review"), {
            ...data,
            createdAt: new Date() 
        });
        console.log("Document written with ID: ", docRef.id);
        return { success: true, id: docRef.id, error: null };
    } catch (err) {
        console.error("Error adding document: ", err);
        return { success: false, id: null, error: err };
    }
}