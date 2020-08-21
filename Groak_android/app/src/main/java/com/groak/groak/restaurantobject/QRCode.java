/**
 * QRCode
 */
package com.groak.groak.restaurantobject;

import com.google.firebase.firestore.DocumentReference;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.firebase.firestoreAPICalls.FirestoreAPICallsCategories;
import com.groak.groak.firebase.firestoreAPICalls.FirestoreAPICallsDishes;
import com.groak.groak.restaurantobject.dish.Dish;

import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

public class QRCode {
    private String name;
    private DocumentReference reference;
    private String restaurantName;
    private DocumentReference restaurantReference;
    private boolean available;
    private MenuCategory[] categories;
    private ArrayList<DocumentReference> categoriesReference;

    public QRCode() {
        this.name = "";
        this.reference = null;
        this.restaurantName = "";
        this.restaurantReference = null;
        this.available = false;
        this.categoriesReference = null;
    }

    public QRCode(Map<String, Object> map) {
        this.name = (String)map.get("name");
        this.reference = (DocumentReference)map.get("reference");
        this.restaurantName = (String)map.get("restaurantName");
        this.restaurantReference = (DocumentReference)map.get("restaurantReference");
        this.available = (boolean)map.get("available");
        this.categoriesReference = (ArrayList<DocumentReference>)map.get("categories");
    }

    public QRCode(Map<String, Object> map, final GroakCallback callback) {
        this.name = (String)map.get("name");
        this.reference = (DocumentReference)map.get("reference");
        this.restaurantName = (String)map.get("restaurantName");
        this.restaurantReference = (DocumentReference)map.get("restaurantReference");
        this.available = (boolean)map.get("available");
        this.categoriesReference = (ArrayList<DocumentReference>)map.get("categories");
        downloadCategories(callback);
    }

    public void downloadCategories(final GroakCallback callback) {

        final AtomicInteger workCounter = new AtomicInteger();

        this.categories = new MenuCategory[categoriesReference.size()];
        for (int i = 0; i < categoriesReference.size(); i++) {
            final int finalI = i;
            workCounter.incrementAndGet();
            FirestoreAPICallsCategories.fetchCategoryFirestoreAPI(categoriesReference.get(i), new GroakCallback() {
                @Override
                public void onSuccess(Object object) {
                    categories[finalI] = (MenuCategory) object;
                    categories[finalI].downloadDishes(new GroakCallback() {
                        @Override
                        public void onSuccess(Object object) {
                            workCounter.decrementAndGet();
                            if (workCounter.get() == 0)  callback.onSuccess(categories);
                        }
                        @Override
                        public void onFailure(Exception e) {
                            callback.onFailure(e);
                        }
                    });
                }
                @Override
                public void onFailure(Exception e) {
                    callback.onFailure(e);
                }
            });
        }
    }

    public String getName() {
        return name;
    }
    public DocumentReference getReference() {
        return reference;
    }
    public String getRestaurantName() {
        return restaurantName;
    }
    public DocumentReference getRestaurantReference() {
        return restaurantReference;
    }
    public boolean isAvailable() {
        return available;
    }
    public ArrayList<DocumentReference> getCategoriesReference() {
        return categoriesReference;
    }
    public MenuCategory[] getCategories() {
        return categories;
    }

    @Override
    public String toString() {
        return "QRCode{" +
                "name='" + name + '\'' +
                ", reference=" + reference +
                ", restaurantName='" + restaurantName + '\'' +
                ", restaurantReference=" + restaurantReference +
                ", available=" + available +
                ", categoriesReference=" + categoriesReference +
                '}';
    }
}
