import firebase from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDQU36COmyGiqpXOQps-4t2zA2w0JHrRJo",
    authDomain: "nwitter-cc167.firebaseapp.com",
    projectId: "nwitter-cc167",
    storageBucket: "nwitter-cc167.appspot.com",
    messagingSenderId: "107386766090",
    appId: "1:107386766090:web:7e402bd2cf8f1a2ff730f3"
};
// Initialize Firebase
export default firebase.initializeApp(firebaseConfig);