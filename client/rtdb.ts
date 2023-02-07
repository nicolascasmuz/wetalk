import firebase from "firebase";

const app = firebase.initializeApp({
  apiKey: "AIzaSyAj_P6_wQ5fKz6LZFSvYKw-O38ubxljOzk",
  authDomain: "rooms-f59c5.firebaseapp.com",
  databaseURL:
    "https://rooms-f59c5-default-rtdb.europe-west1.firebasedatabase.app/",
});

const rtdb = firebase.database();

export { rtdb };
