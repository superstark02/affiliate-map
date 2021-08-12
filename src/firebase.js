import firebase from 'firebase';
import "firebase/auth";
import 'firebase/database';

var firebaseConfig = {
  apiKey: "AIzaSyD0_RbwyHugdj2v595rTwGZfPCdWhdKIc4",
  authDomain: "dipit-sharma.firebaseapp.com",
  databaseURL: "https://dipit-sharma-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dipit-sharma",
  storageBucket: "dipit-sharma.appspot.com",
  messagingSenderId: "649245617138",
  appId: "1:649245617138:web:bb4bd61a15196215fe196b",
  measurementId: "G-Z8MEYG6XV2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth();
export const db = firebase.firestore();
export const rdb = firebase.database();
export const storage = firebase.storage();

export default firebase;