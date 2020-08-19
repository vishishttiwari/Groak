package com.groak.groak.firebase.firestoreAPICalls;

import android.content.Context;
import android.content.Intent;

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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.UUID;

public class FirestoreAPICallsOrders {

    static ListenerRegistration registration;

    public static void fetchOrderFirestoreAPI(final Context context, final GroakCallback callback) {
        registration = LocalRestaurant.orderReference.addSnapshotListener(new EventListener<DocumentSnapshot>() {
            @Override
            public void onEvent(@Nullable DocumentSnapshot document,
                                @Nullable FirebaseFirestoreException e) {
                if (e != null) {
                    callback.onFailure(e);
                    return;
                }

                if (document != null && document.exists() && document.getData() != null) {
                    Order order = new Order(document.getData());
                    LocalRestaurant.requestNotifications = order.isNewRequestForUser();
                    Intent intent = new Intent("refresh_order");
                    context.sendBroadcast(intent);
                    Intent intent1 = new Intent("change_request_badge");
                    context.sendBroadcast(intent1);
                    RealmWrapper.downloadDishesAndComments(context, order);
                    callback.onSuccess(order);
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

    public static void addOrdersFirestoreAPI(Context context, final GroakCallback callback) {
        final Order order = new Order(LocalRestaurant.cart);

        if (!order.success()) {
            callback.onFailure(new Exception("Order is not successful"));
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

        // Add to realm/coredata
        RealmWrapper.addDishesAndComments(context, order);

        final DocumentReference orderReference = LocalRestaurant.orderReference;
        final DocumentReference tableReference = LocalRestaurant.table.getReference();
        final DocumentReference tableOriginalReference = LocalRestaurant.table.getOriginalReference();

        Firebase.firebase.db.runTransaction(new Transaction.Function<Void>() {
            @Override
            public Void apply(Transaction transaction) throws FirebaseFirestoreException {
                DocumentSnapshot orderDocument = transaction.get(orderReference);

                Order savedOrder = new Order(orderDocument.getData());

                ArrayList<HashMap<String, Object>> newComments = new ArrayList<>();
                for (OrderComment comment: savedOrder.getComments())
                    newComments.add(comment.getDictionary());
                for (OrderComment comment: order.getComments())
                    newComments.add(comment.getDictionary());

                ArrayList<HashMap<String, Object>> newDishes = new ArrayList<>();
                for (OrderDish dish: savedOrder.getDishes())
                    newDishes.add(dish.getDictionary());
                for (OrderDish dish: order.getDishes())
                    newDishes.add(dish.getDictionary());

                HashMap<String, Object> updatedOrderMap = new HashMap<>();
                updatedOrderMap.put("comments", newComments);
                updatedOrderMap.put("dishes", newDishes);
                updatedOrderMap.put("status", TableStatus.ordered);
                updatedOrderMap.put("updated", Timestamp.now());
                updatedOrderMap.put("items", order.getItems() + savedOrder.getItems());

                HashMap<String, Object> updatedTableMap = new HashMap<>();
                updatedTableMap.put("status", TableStatus.ordered);

                if (savedOrder.getStatus() == TableStatus.seated || savedOrder.getStatus() == TableStatus.available)
                    updatedOrderMap.put("serveTime", TimeCatalog.addThirtyMinutesToTimestamp());

                transaction.update(orderReference, updatedOrderMap);
                transaction.update(tableReference, updatedTableMap);
                transaction.update(tableOriginalReference, updatedTableMap);

                // Success
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

    public static void addCommentFirestoreAPI(Context context, final OrderComment comment, final GroakCallback callback) {
        final Order order = new Order(LocalRestaurant.cart);

        if (!comment.success()) {
            callback.onFailure(new Exception("Comment is not successful"));
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

        // Add to realm/coredata
        RealmWrapper.addComment(context, comment);

        final DocumentReference orderReference = LocalRestaurant.orderReference;
        final DocumentReference tableReference = LocalRestaurant.table.getReference();
        final DocumentReference tableOriginalReference = LocalRestaurant.table.getOriginalReference();

        Firebase.firebase.db.runTransaction(new Transaction.Function<Void>() {
            @Override
            public Void apply(Transaction transaction) throws FirebaseFirestoreException {
                DocumentSnapshot orderDocument = transaction.get(orderReference);

                Order savedOrder = new Order(orderDocument.getData());

                ArrayList<HashMap<String, Object>> newComments = new ArrayList<>();
                for (OrderComment comment: savedOrder.getComments())
                    newComments.add(comment.getDictionary());
                newComments.add(comment.getDictionary());

                HashMap<String, Object> updatedOrderMap = new HashMap<>();
                updatedOrderMap.put("comments", newComments);
                updatedOrderMap.put("status", TableStatus.ordered);
                updatedOrderMap.put("updated", Timestamp.now());
                updatedOrderMap.put("items", order.getItems() + savedOrder.getItems());

                HashMap<String, Object> updatedTableMap = new HashMap<>();
                updatedTableMap.put("status", TableStatus.ordered);

                if (savedOrder.getStatus() == TableStatus.seated || savedOrder.getStatus() == TableStatus.available)
                    updatedOrderMap.put("serveTime", TimeCatalog.addThirtyMinutesToTimestamp());

                transaction.update(orderReference, updatedOrderMap);
                transaction.update(tableReference, updatedTableMap);
                transaction.update(tableOriginalReference, updatedTableMap);

                // Success
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

    public static void newRequestForUserSeenFirestoreAPI() {
        final DocumentReference orderReference = LocalRestaurant.orderReference;
        final DocumentReference tableReference = LocalRestaurant.table.getReference();
        final DocumentReference tableOriginalReference = LocalRestaurant.table.getOriginalReference();

        Firebase.firebase.db.runTransaction(new Transaction.Function<Void>() {
            @Override
            public Void apply(Transaction transaction) throws FirebaseFirestoreException {
                HashMap<String, Object> updatedMap = new HashMap<>();
                updatedMap.put("newRequestForUser", false);

                transaction.update(orderReference, updatedMap);
                transaction.update(tableReference, updatedMap);
                transaction.update(tableOriginalReference, updatedMap);

                // Success
                return null;
            }
        }).addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
            }
        });
    }

    public static void seatedFirestoreAPI() {
        final DocumentReference orderReference = LocalRestaurant.orderReference;
        final DocumentReference requestReference = LocalRestaurant.requestReference;
        final DocumentReference tableReference = LocalRestaurant.table.getReference();
        final DocumentReference tableOriginalReference = LocalRestaurant.table.getOriginalReference();

        Firebase.firebase.db.runTransaction(new Transaction.Function<Void>() {
            @Override
            public Void apply(Transaction transaction) throws FirebaseFirestoreException {
                DocumentSnapshot orderDocument = transaction.get(orderReference);

                Order savedOrder = new Order(orderDocument.getData());

                ArrayList<String> newSessionIds;
                if (savedOrder.getSessionIds() != null)
                    newSessionIds = savedOrder.getSessionIds();
                else
                    newSessionIds = new ArrayList<>();
                newSessionIds.add(LocalRestaurant.sessionId.getSessionId());

                HashMap<String, Object> updatedAllMap = new HashMap<>();
                updatedAllMap.put("sessionIds", newSessionIds);
                if (savedOrder.getStatus() == TableStatus.available)
                    updatedAllMap.put("status", TableStatus.seated);

                HashMap<String, Object> updatedRequestMap = new HashMap<>();
                updatedRequestMap.put("sessionIds", newSessionIds);

                transaction.update(orderReference, updatedAllMap);
                transaction.update(tableReference, updatedAllMap);
                transaction.update(tableOriginalReference, updatedAllMap);
                transaction.update(requestReference, updatedRequestMap);

                // Success
                return null;
            }
        }).addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
            }
        });
    }

    public static void readyForPaymentFirestoreAPI() {
        final DocumentReference orderReference = LocalRestaurant.orderReference;
        final DocumentReference tableReference = LocalRestaurant.table.getReference();
        final DocumentReference tableOriginalReference = LocalRestaurant.table.getOriginalReference();

        Firebase.firebase.db.runTransaction(new Transaction.Function<Void>() {
            @Override
            public Void apply(Transaction transaction) throws FirebaseFirestoreException {
                HashMap<String, Object> updatedMap = new HashMap<>();
                updatedMap.put("status", TableStatus.payment);

                transaction.update(orderReference, updatedMap);
                transaction.update(tableReference, updatedMap);
                transaction.update(tableOriginalReference, updatedMap);

                // Success
                return null;
            }
        }).addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
            }
        });
    }
}
