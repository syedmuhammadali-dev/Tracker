import firebase from '@react-native-firebase/app';

// Firebase configuration placeholder
// You will need to replace these with actual values from Firebase Console
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'safecircle-pk.firebaseapp.com',
  projectId: 'safecircle-pk',
  storageBucket: 'safecircle-pk.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

export const initializeFirebase = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
};

export default firebase;
