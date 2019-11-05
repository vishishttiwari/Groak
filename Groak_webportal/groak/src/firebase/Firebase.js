/**
 * This class is used for configuration of the firebase. For google maps api, the script is in index.html in public folder
 * This class also returns different firebase components like authentication, storage etc.
 */
import firebase from 'firebase';

const config = {
    apiKey: 'AIzaSyDj-sHwjRDiNgGs6BS9FVX9cTX7T5oS16Y',
    authDomain: 'finedine-1.firebaseapp.com',
    databaseURL: 'https://finedine-1.firebaseio.com',
    projectId: 'finedine-1',
    storageBucket: 'finedine-1.appspot.com',
    messagingSenderId: '126653073255',
    appId: '1:126653073255:web:ee1cfb1d8b8af18a',
};
firebase.initializeApp(config);

export const db = firebase.firestore();
export const deleteField = firebase.firestore.FieldValue.delete();
export const auth = firebase.auth();
export const storageRef = firebase.storage().ref();
export const getCurrentDateTime = () => {
    return firebase.firestore.Timestamp.fromDate(new Date());
};
