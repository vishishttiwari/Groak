/**
 * Restaurant related firebase functions
 */
package com.groak.groak.firebase.firestoreAPICalls;

import android.location.Location;

import androidx.annotation.NonNull;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.GeoPoint;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;
import com.groak.groak.catalog.DistanceCatalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.firebase.Firebase;
import com.groak.groak.restaurantobject.restaurant.Restaurant;

import java.util.ArrayList;

public class FirestoreAPICallsRestaurants {

    /**
     * Fetch restaurant
     *
     * @param restaurantReference
     * @param callback
     */
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

    /**
     * Fetch closest restaurant. This can actually only get using latitude. For getting closer
     * to longitude, 'DistanceCatalog.getRestaurantNearCurrentLocation' is used.
     *
     * @param loc
     * @param callback
     */
    public static void fetchClosestRestaurantFirestoreAPI(Location loc, final GroakCallback callback) {
        Location minLocation = DistanceCatalog.getMinGeoPoint(loc);
        Location maxLocation = DistanceCatalog.getMaxGeoPoint(loc);

        GeoPoint minLocationGeoPoint = new GeoPoint(minLocation.getLatitude(), minLocation.getLongitude());
        GeoPoint maxLocationGeoPoint = new GeoPoint(maxLocation.getLatitude(), maxLocation.getLongitude());

        final ArrayList<Restaurant> restaurants = new ArrayList<>();

        Firebase.firebase.db.collection("restaurants")
                .whereGreaterThanOrEqualTo("location", minLocationGeoPoint)
                .whereLessThanOrEqualTo("location", maxLocationGeoPoint)
                .get().addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
            @Override
            public void onComplete(@NonNull Task<QuerySnapshot> task) {
                if (task.isSuccessful()) {
                    for (QueryDocumentSnapshot document : task.getResult()) {
                        restaurants.add(new Restaurant(document.getData()));
                    }

                    ArrayList<Restaurant> newRestaurants = DistanceCatalog.getRestaurantNearCurrentLocation(restaurants, minLocation, maxLocation, loc);
                    callback.onSuccess(newRestaurants);
                } else {
                    callback.onFailure(null);
                }
            }
        });
    }
}
