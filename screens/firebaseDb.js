import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBmVDF4I2224bAN-yuUKP-kbAAwTLp3ftQ",
    authDomain: "plansyek-fc5d9.firebaseapp.com",
    databaseURL: "https://plansyek-fc5d9.firebaseio.com",
    projectId: "plansyek-fc5d9",
    storageBucket: "plansyek-fc5d9.appspot.com",
    messagingSenderId: "306780241671",
    appId: "1:306780241671:web:b03d52c72c7a6ae441cfa2"
}

firebase.initializeApp(firebaseConfig)

firebase.firestore()

export default firebase