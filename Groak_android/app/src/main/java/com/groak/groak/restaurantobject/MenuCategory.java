/**
 * MenuCategory
 */
package com.groak.groak.restaurantobject;

import com.google.firebase.firestore.DocumentReference;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.catalog.TimeCatalog;
import com.groak.groak.firebase.firestoreAPICalls.FirestoreAPICallsDishes;
import com.groak.groak.restaurantobject.dish.Dish;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

public class MenuCategory {
    private DocumentReference reference;
    private String name;
    private Dish[] dishes;
    private ArrayList<DocumentReference> dishesReference;
    private ArrayList<String> daysAvailable;
    private HashMap<String, Long> startTime;
    private HashMap<String, Long> endTime;
    private boolean available;

    public MenuCategory(Map<String, Object> map) {
        this.reference = (DocumentReference)map.get("reference");
        this.name = (String)map.get("name");
        this.dishesReference = (ArrayList<DocumentReference>)map.get("dishes");
        this.daysAvailable = (ArrayList<String>)map.get("days");
        this.startTime = (HashMap<String, Long>)map.get("startTime");
        this.endTime = (HashMap<String, Long>)map.get("endTime");
        this.available = (boolean)map.get("available");
    }

    public MenuCategory(Map<String, Object> map, final GroakCallback callback) {
        this.reference = (DocumentReference)map.get("reference");
        this.name = (String)map.get("name");
        this.dishesReference = (ArrayList<DocumentReference>)map.get("dishes");
        this.daysAvailable = (ArrayList<String>)map.get("days");
        this.startTime = (HashMap<String, Long>)map.get("startTime");
        this.endTime = (HashMap<String, Long>)map.get("endTime");
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
    public HashMap<String, Long> getStartTime() {
        return startTime;
    }
    public HashMap<String, Long> getEndTime() {
        return endTime;
    }
    public boolean isAvailable() {
        return available;
    }

    public boolean checkIfCategoryIsAvailable() {
        String day = TimeCatalog.getDay();
        int time = TimeCatalog.getTimeInMinutes();
        long startTimeForDay = startTime.get(day);
        long endTimeForDay = endTime.get(day);

        if (!daysAvailable.contains(day)) return false;
        if (time < startTimeForDay) return false;
        if (time > endTimeForDay) return false;
        return available;
    }

    @Override
    public String toString() {
        return "MenuCategory{" +
                "reference=" + reference +
                ", name='" + name + '\'' +
                ", dishes=" + Arrays.toString(dishes) +
                ", dishesReference=" + dishesReference +
                ", daysAvailable=" + daysAvailable +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", available=" + available +
                '}';
    }
}
