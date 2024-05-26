import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDKqV1_rCNes7y9xOeJnrzgyrt_D6I_F1w",
  authDomain: "kazaa-8481b.firebaseapp.com",
  databaseURL: "https://kazaa-8481b-default-rtdb.firebaseio.com",
  projectId: "kazaa-8481b",
  storageBucket: "kazaa-8481b.appspot.com",
  messagingSenderId: "570049508364",
  appId: "1:570049508364:web:5a2835ac72dcd7448faa29",
  measurementId: "G-N289W1GX2Z"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const firestore = app.firestore();

export const database = {
  folders: firestore.collection("folders"),
  files: firestore.collection("files"),
  formatDoc: (doc) => {
    return { id: doc.id, ...doc.data() };
  },
  getCurrentTimestamp: firebase.firestore.FieldValue.serverTimestamp,
};


export const storage = app.storage();
export const auth = app.auth();
export default app;
