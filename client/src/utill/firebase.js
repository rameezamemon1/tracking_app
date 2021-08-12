import firebase from 'firebase'

var firebaseConfig = {
    apiKey: "AIzaSyCm6d6uLKvgkSl-3-2aKrpOSZjscsf-by8",
    authDomain: "monitoring-app-ad983.firebaseapp.com",
    projectId: "monitoring-app-ad983",
    storageBucket: "monitoring-app-ad983.appspot.com",
    messagingSenderId: "315767041890",
    appId: "1:315767041890:web:29979f563519944530c63b"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics()
export default firebase;
