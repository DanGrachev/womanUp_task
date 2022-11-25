import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyCIvoIg7GlYcTHCLMScEw6Xyb2o6OmOHjo",
    authDomain: "todolist-8f191.firebaseapp.com",
    projectId: "todolist-8f191",
    storageBucket: "todolist-8f191.appspot.com",
    messagingSenderId: "356413857738",
    appId: "1:356413857738:web:7fd8b42a59dae1de98b933"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app)