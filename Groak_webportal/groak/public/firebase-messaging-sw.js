importScripts('https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js');

// Your web app's Firebase configuration
const firebaseConfig = {
    messagingSenderId: '448899776119',
};

// Initialize Firebase
if (firebase.messaging.isSupported()) {
    firebase.initializeApp(firebaseConfig);

    const messaging = firebase.messaging();
    messaging.setBackgroundMessageHandler((payload) => {
        console.log(payload);
        return self.registration.showNotification('hey', {
            body: 'wow',
        });
        // return self.registration.showNotification(payload.data.title, {
        //     body: payload.data.body,
        //     icon: './favicon_io/android-chrome-512x512.png',
        //     tag: payload.data.title.tag,
        // });
    });
} else {
    console.log('no-support :(');
}
