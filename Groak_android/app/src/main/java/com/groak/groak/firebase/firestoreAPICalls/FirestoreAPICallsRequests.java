package com.groak.groak.firebase.firestoreAPICalls;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.Timestamp;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.google.firebase.firestore.ListenerRegistration;
import com.google.firebase.firestore.Transaction;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.catalog.TimeCatalog;
import com.groak.groak.firebase.Firebase;
import com.groak.groak.localstorage.LocalRestaurant;
import com.groak.groak.localstorage.RealmWrapper;
import com.groak.groak.restaurantobject.TableStatus;
import com.groak.groak.restaurantobject.order.Order;
import com.groak.groak.restaurantobject.order.OrderComment;
import com.groak.groak.restaurantobject.order.OrderDish;
import com.groak.groak.restaurantobject.request.Request;
import com.groak.groak.restaurantobject.request.Requests;

import java.util.ArrayList;
import java.util.HashMap;

public class FirestoreAPICallsRequests {
    static ListenerRegistration registration;

    public static void fetchRequestFirestoreAPI(final GroakCallback callback) {
        registration = LocalRestaurant.requestReference.addSnapshotListener(new EventListener<DocumentSnapshot>() {
            @Override
            public void onEvent(@Nullable DocumentSnapshot snapshot,
                                @Nullable FirebaseFirestoreException e) {
                if (e != null) {
                    callback.onFailure(e);
                    return;
                }

                if (snapshot != null && snapshot.exists()) {
                    Requests requests = new Requests(snapshot.getData());
                    callback.onSuccess(requests);
                }
                else
                    callback.onFailure(null);
            }
        });
    }

    public static void unsubscribe() {
        if (registration != null)
            registration.remove();
    }

    public static void addRequestFirestoreAPI(final Request newRequest, final GroakCallback callback) {
        if (LocalRestaurant.requestReference == null) {
            callback.onFailure(new Exception("Request reference is null"));
            return;
        }
        if (LocalRestaurant.orderReference == null) {
            callback.onFailure(new Exception("Order reference is null"));
            return;
        }
        if (LocalRestaurant.table.getReference() == null) {
            callback.onFailure(new Exception("Table reference is null"));
            return;
        }
        if (LocalRestaurant.table.getOriginalReference() == null) {
            callback.onFailure(new Exception("Original Table reference is null"));
            return;
        }

        final DocumentReference requestReference = LocalRestaurant.requestReference;
        final DocumentReference orderReference = LocalRestaurant.orderReference;
        final DocumentReference tableReference = LocalRestaurant.table.getReference();
        final DocumentReference tableOriginalReference = LocalRestaurant.table.getOriginalReference();

        Firebase.firebase.db.runTransaction(new Transaction.Function<Void>() {
            @Override
            public Void apply(Transaction transaction) throws FirebaseFirestoreException {
                DocumentSnapshot orderDocument = transaction.get(requestReference);

                Requests requests = new Requests(orderDocument.getData());

                ArrayList<HashMap<String, Object>> newRequests = new ArrayList<>();
                for (Request request: requests.getRequests())
                    newRequests.add(request.getDictionary());
                newRequests.add(newRequest.getDictionary());

                HashMap<String, Object> updatedRequestsMap = new HashMap<>();
                updatedRequestsMap.put("requests", newRequests);

                HashMap<String, Object> updatedOrderMap = new HashMap<>();
                updatedOrderMap.put("newRequest", true);
                updatedOrderMap.put("updated", Timestamp.now());

                HashMap<String, Object> updatedTableMap = new HashMap<>();
                updatedOrderMap.put("newRequest", true);

                transaction.update(requestReference, updatedRequestsMap);
                transaction.update(orderReference, updatedOrderMap);
                transaction.update(tableReference, updatedTableMap);
                transaction.update(tableOriginalReference, updatedTableMap);

                return null;
            }
        }).addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                callback.onSuccess(null);
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                callback.onFailure(null);
            }
        });
    }
}
