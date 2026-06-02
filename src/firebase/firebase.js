import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCy93NFb5VAAWCZ_au-t_GfVErRpyE7nP8",
  authDomain: "pat-garden-68ec4.firebaseapp.com",
  projectId: "pat-garden-68ec4",
  storageBucket: "pat-garden-68ec4.firebasestorage.app",
  messagingSenderId: "308434449827",
  appId: "1:308434449827:web:6e386c6770f928909a5616"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };