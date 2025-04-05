import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAkoj-Qgg6naftJq1PAbAv3hlLt3nnwXVg",
  authDomain: "hospitalmanagment-e87e5.firebaseapp.com",
  databaseURL: "https://hospitalmanagment-e87e5-default-rtdb.firebaseio.com",
  projectId: "hospitalmanagment-e87e5",
  storageBucket: "hospitalmanagment-e87e5.appspot.com",
  messagingSenderId: "774783064434",
  appId: "1:774783064434:web:858edca20f2371938725eb"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyAWWWOu3y_N_dX6ZQO6X9SQx75OQhjdHkI",
//   authDomain: "bassmartsupermarket.firebaseapp.com",
//   projectId: "bassmartsupermarket",
//   storageBucket: "bassmartsupermarket.firebasestorage.app",
//   messagingSenderId: "60318617643",
//   appId: "1:60318617643:web:c2c7647178d0ec6cec1a6e",
//   measurementId: "G-MQZH9YSPBQ"
// };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

export { app, auth, db };
