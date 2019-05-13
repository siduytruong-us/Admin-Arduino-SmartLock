import firebase from 'firebase/app'
import 'firebase/firebase-firestore'
import 'firebase/firebase-database'

const firebaseConfig = {
    apiKey: "AIzaSyDZUS2dtXmWEDul3SpPhmuSfKeflx3eYbE",
    authDomain: "smart-lock-server-arduino.firebaseapp.com",
    databaseURL: "https://smart-lock-server-arduino.firebaseio.com",
    projectId: "smart-lock-server-arduino",
    storageBucket: "smart-lock-server-arduino.appspot.com",
    messagingSenderId: "298207913612",
    appId: "1:298207913612:web:708da609adf92048"
  };


firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({timestampsInSnapshots:true});

export default firebase;