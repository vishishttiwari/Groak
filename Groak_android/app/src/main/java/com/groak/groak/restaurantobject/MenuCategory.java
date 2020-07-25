package com.groak.groak.restaurantobject;

import com.google.firebase.firestore.DocumentReference;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.catalog.TimeCatalog;
import com.groak.groak.firebase.firestoreAPICalls.FirestoreAPICallsDishes;
import com.groak.groak.restaurantobject.dish.Dish;

import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

public class MenuCategory {
    private DocumentReference reference;
    private String name;
    private Dish[] dishes;
    private ArrayList<DocumentReference> dishesReference;
    private ArrayList<String> daysAvailable;
    private long startTime;
    private long endTime;
    private boolean available;

    public MenuCategory(Map<String, Object> map) {
        this.reference = (DocumentReference)map.get("reference");
        this.name = (String)map.get("name");
        this.dishesReference = (ArrayList<DocumentReference>)map.get("dishes");
        this.daysAvailable = (ArrayList<String>)map.get("days");
        this.startTime = (long)map.get("startTime");
        this.endTime = (long)map.get("endTime");
        this.available = (boolean)map.get("available");
    }

    public MenuCategory(Map<String, Object> map, final GroakCallback callback) {
        this.reference = (DocumentReference)map.get("reference");
        this.name = (String)map.get("name");
        this.dishesReference = (ArrayList<DocumentReference>)map.get("dishes");
        this.daysAvailable = (ArrayList<String>)map.get("days");
        this.startTime = (long)map.get("startTime");
        this.endTime = (long)map.get("endTime");
        this.available = (boolean)map.get("available");
        downloadDishes(callback);
    }

    public void downloadDishes(final GroakCallback callback) {

        final AtomicInteger workCounter = new AtomicInteger();

        this.dishes = new Dish[dishesReference.size()];
        for (int i = 0; i < dishesReference.size(); i++) {
            final int finalI = i;
            workCounter.incrementAndGet();
            FirestoreAPICallsDishes.fetchDishFirestoreAPI(dishesReference.get(i), new GroakCallback() {
                @Override
                public void onSuccess(Object object) {
                    dishes[finalI] = (Dish)object;
                    workCounter.decrementAndGet();
                    if (workCounter.get() == 0)  callback.onSuccess(dishes);
                }
                @Override
                public void onFailure(Exception e) {
                    callback.onFailure(e);
                }
            });
        }
    }

    public DocumentReference getReference() {
        return reference;
    }
    public String getName() {
        return name;
    }
    public Dish[] getDishes() {
        return dishes;
    }
    public ArrayList<DocumentReference> getDishesReference() {
        return dishesReference;
    }
    public ArrayList<String> getDaysAvailable() {
        return daysAvailable;
    }
    public long getStartTime() {
        return startTime;
    }
    public long getEndTime() {
        return endTime;
    }
    public boolean isAvailable() {
        return available;
    }

    public boolean checkIfCategoryIsAvailable() {
        if (!daysAvailable.contains(TimeCatalog.getDay()))
            return false;
        if (startTime > TimeCatalog.getTimeInMinutes())
            return false;
        if (endTime <= TimeCatalog.getTimeInMinutes())
            return false;
        return available;
    }

    public String toString() {
        String str = "";
        str += "Reference: " + reference + "\n";
        str += "Name: " + name + "\n";
        str += "Dishes: " + dishes + "\n";
        str += "DishReferences: " + dishesReference + "\n";
        str += "Start Time: " + startTime + "\n";
        str += "Available: " + available + "\n";
        return str;
    }
}
