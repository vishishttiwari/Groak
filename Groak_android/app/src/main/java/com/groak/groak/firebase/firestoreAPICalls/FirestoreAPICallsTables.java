package com.groak.groak.firebase.firestoreAPICalls;

import androidx.annotation.NonNull;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.firebase.Firebase;
import com.groak.groak.restaurantobject.Table;

public class FirestoreAPICallsTables {
    public static void fetchTableFirestoreAPI(String tableReference, final GroakCallback callback) {
        DocumentReference docRef = Firebase.firebase.db.collection("tables").document(tableReference);
        docRef.get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
            @Override
            public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                if (task.isSuccessful()) {
                    DocumentSnapshot document = task.getResult();
                    if (document.exists()) {
                        callback.onSuccess(new Table(document.getData()));
                    } else
                        callback.onFailure(new Exception("Table not found"));
                } else {
                    callback.onFailure(task.getException());
                }
            }
        });
    }
}
