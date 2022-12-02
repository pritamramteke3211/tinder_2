// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import firebase from 'firebase/compat/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAPCgF6HmxECEnzhBpBYSIc49gHraMwMBE',
  authDomain: 'tinder2t.firebaseapp.com',
  projectId: 'tinder2t',
  storageBucket: 'tinder2t.appspot.com',
  messagingSenderId: '1019972796430',
  appId: '1:1019972796430:web:074c5070e8d3bf5a17bc5f',
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// const todoRef = app.firestore().collection("newData")

// const auth = getAuth();
// const db = getFirestore()

// export {auth, db, todoRef }

export {firebase};
