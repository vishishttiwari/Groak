package com.groak.groak.firebase.firestoreAPICalls;

import androidx.annotation.NonNull;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.catalog.TimeCatalog;
import com.groak.groak.firebase.Firebase;
import com.groak.groak.localstorage.LocalRestaurant;
import com.groak.groak.restaurantobject.MenuCategory;
import com.groak.groak.restaurantobject.Restaurant;

import java.util.ArrayList;
import java.util.concurrent.atomic.AtomicInteger;

public class FirestoreAPICallsRestaurants {
    public static void fetchRestaurantFirestoreAPI(String restaurantReference, final GroakCallback callback) {
        DocumentReference docRef = Firebase.firebase.db.collection("restaurants").document(restaurantReference);
        docRef.get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
            @Override
            public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                if (task.isSuccessful()) {
                    DocumentSnapshot document = task.getResult();
                    if (document.exists())
                        callback.onSuccess(new Restaurant(document.getData()));
                    else
                        callback.onFailure(new Exception("No restaurant found"));
                } else {
                    callback.onFailure(task.getException());
                }
            }
        });
    }

    public static void fetchRestaurantCategoriesFirestoreAPI(final GroakCallback callback) {
        String day = TimeCatalog.getDay();
        int time = TimeCatalog.getTimeInMinutes();

        CollectionReference collectionRef = LocalRestaurant.restaurant.getReference().collection("/categories");
        
        final ArrayList<MenuCategory> categories = new ArrayList<>();

        collectionRef.whereArrayContains("days", day)
                .whereLessThanOrEqualTo("startTime", time)
                .orderBy("startTime")
                .orderBy("order").get().addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                    @Override
                    public void onComplete(@NonNull Task<QuerySnapshot> task) {
            if (task.isSuccessful()) {
                for (QueryDocumentSnapshot document : task.getResult()) {
                    MenuCategory category = new MenuCategory(document.getData());
                    if (category.checkIfCategoryIsAvailable())
                        categories.add(category);
                }
                callback.onSuccess(categories);
            } else {
                callback.onFailure(task.getException());
            }
            }
        });
    }

    public static void fetchRestaurantCategoriesAndDishesFirestoreAPI(final GroakCallback callback) {
        final String day = TimeCatalog.getDay();
        final int time = TimeCatalog.getTimeInMinutes();

        CollectionReference collectionRef = LocalRestaurant.restaurant.getReference().collection("/categories");

        final AtomicInteger workCounter = new AtomicInteger();

        final ArrayList<MenuCategory> categories = new ArrayList<>();

        collectionRef.whereArrayContains("days", day)
                .get().addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
            @Override
            public void onComplete(@NonNull Task<QuerySnapshot> task) {
                if (task.isSuccessful()) {
                    for (QueryDocumentSnapshot document : task.getResult()) {
//                        ArrayList<String> daysAvailable = (ArrayList<String>)document.getData().get("days");
//                        long startTime = (long)document.getData().get("startTime");
//                        long endTime = (long)document.getData().get("endTime");
//                        boolean available = (boolean)document.getData().get("available");
//
//                        if (!daysAvailable.contains(day))
//                            continue;
//                        if (startTime > TimeCatalog.getTimeInMinutes())
//                            continue;
//                        if (endTime <= TimeCatalog.getTimeInMinutes())
//                            continue;
//                        if (!available)
//                            continue;

                        workCounter.incrementAndGet();
                        categories.add(new MenuCategory(document.getData(), new GroakCallback() {
                            @Override
                            public void onSuccess(Object object) {
                                workCounter.decrementAndGet();
                                if (workCounter.get() == 0)  callback.onSuccess(categories);
                            }
                            @Override
                            public void onFailure(Exception e) {
                                callback.onFailure(e);
                            }
                        }));
                    }
                } else {
                    callback.onFailure(task.getException());
                }
            }
        });
    }
}
