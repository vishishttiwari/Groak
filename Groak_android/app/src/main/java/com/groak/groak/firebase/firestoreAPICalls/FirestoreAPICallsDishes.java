package com.groak.groak.firebase.firestoreAPICalls;

import androidx.annotation.NonNull;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.restaurantobject.dish.Dish;

public class FirestoreAPICallsDishes {
    public static void fetchDishFirestoreAPI(DocumentReference dishRef, final GroakCallback callback) {
        dishRef.get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
            @Override
            public void onComplete(@NonNull Task<DocumentSnapshot> task) {
            if (task.isSuccessful()) {
                DocumentSnapshot document = task.getResult();
                if (document.exists()) {
                    callback.onSuccess(new Dish(document.getData()));
                } else {
                    callback.onFailure(new Exception("No such document"));
                }
            } else {
                callback.onFailure(new Exception(task.getException()));
            }
            }
        });
    }
}
