/**
 * This class is used for configuration of the firebase. For google maps api, the script is in index.html in public folder
 * This class also returns different firebase components like authentication, storage etc.
 */
import firebase from 'firebase/app';

import 'firebase/auth'; // for authentication
import 'firebase/storage'; // for storage
import 'firebase/database'; // for realtime database
import 'firebase/firestore'; // for cloud firestore
import 'firebase/analytics'; // for analytics
import 'firebase/messaging'; // for messaging

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyDtGWWB-3PlrB6pW5vEsvaRqrRv2vQKb_I',
    authDomain: 'groak-1.firebaseapp.com',
    databaseURL: 'https://groak-1.firebaseio.com',
    projectId: 'groak-1',
    storageBucket: 'groak-1.appspot.com',
    messagingSenderId: '448899776119',
    appId: '1:448899776119:web:dafbba5c1d8a38d5b7d072',
    measurementId: 'G-R1P29B7S4D',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const increment = firebase.firestore.FieldValue.increment(1);
export const decrement = firebase.firestore.FieldValue.increment(-1);
export const analytics = firebase.analytics();
export const createGeoPoint = (latitude, longitude) => {
    return new firebase.firestore.GeoPoint(latitude, longitude);
};
export const deleteField = firebase.firestore.FieldValue.delete();
export const auth = firebase.auth();
export const storageRef = firebase.storage().ref();
export const getCurrentDateTime = () => {
    return firebase.firestore.Timestamp.fromDate(new Date());
};

let registrationToken = '';

export const fetchRegistrationToken = () => {
    return registrationToken;
};

if (firebase.messaging.isSupported()) {
    const messaging = firebase.messaging();
    messaging.requestPermission()
        .then(() => {
            return messaging.getToken();
        })
        .then((token) => {
            registrationToken = token;
        })
        .catch(() => {
        });

    messaging.onMessage((payload) => {
        console.log(payload);
    });
}
