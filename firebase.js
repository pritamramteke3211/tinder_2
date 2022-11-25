import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAPCgF6HmxECEnzhBpBYSIc49gHraMwMBE",
  authDomain: "tinder2t.firebaseapp.com",
  projectId: "tinder2t",
  storageBucket: "tinder2t.appspot.com",
  messagingSenderId: "1019972796430",
  appId: "1:1019972796430:web:074c5070e8d3bf5a17bc5f"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
    firebase.firestore().settings({ experimentalForceLongPolling: true }); 
}

export { firebase };