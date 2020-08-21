/**
 * Initializing firebase db variable
 */
package com.groak.groak.firebase;

import com.google.firebase.firestore.FirebaseFirestore;

public class Firebase {

    public static Firebase firebase = new Firebase();

    private Firebase() {
    }

    public FirebaseFirestore db = FirebaseFirestore.getInstance();
}
