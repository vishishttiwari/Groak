/**
 * QR Codes related firebase functions
 */
package com.groak.groak.firebase.firestoreAPICalls;

import androidx.annotation.NonNull;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.firebase.Firebase;
import com.groak.groak.restaurantobject.QRCode;

public class FirestoreAPICallsQRCodes {

    /**
     * Fetch QR Code
     *
     * @param restaurantId
     * @param qrCodeID
     * @param callback
     */
    public static void fetchQRCodeFirestoreAPI(String restaurantId, String qrCodeID, final GroakCallback callback) {
        DocumentReference docRef = Firebase.firebase.db.collection("restaurants").document(restaurantId).collection("qrcodes").document(qrCodeID);
        docRef.get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
            @Override
            public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                if (task.isSuccessful()) {
                    DocumentSnapshot document = task.getResult();
                    if (document.exists() && document.getData() != null) {
                        callback.onSuccess(new QRCode(document.getData()));
                    } else
                        callback.onFailure(new Exception("QR Code not found"));
                } else {
                    callback.onFailure(task.getException());
                }
            }
        });
    }
}
