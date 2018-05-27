import firebase from 'firebase'
import firestore from 'firebase/firestore'

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCG3NiXmxnjMxCWNQjLhedPiB50Ym3DQOc",
    authDomain: "open-projects-35ec8.firebaseapp.com",
    databaseURL: "https://open-projects-35ec8.firebaseio.com",
    projectId: "open-projects-35ec8",
    storageBucket: "open-projects-35ec8.appspot.com",
    messagingSenderId: "859887712950"
  };

  const firebaseApp = firebase.initializeApp(config);
  firebaseApp.firestore().settings({ timestampsInSnapshots: true })

  // export firestore database
  export default firebaseApp.firestore()