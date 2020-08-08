package com.groak.groak.restaurantobject.order;

import io.realm.RealmObject;

public class OrderDishSavedInRealm extends RealmObject {
    private String reference;

    public OrderDishSavedInRealm() {
        this.reference = "";
    }

    public OrderDishSavedInRealm(OrderDish dish) {
        this.reference = dish.getReference();
    }

    public OrderDishSavedInRealm(String reference) {
        this.reference = reference;
    }

    public String getReference() {
        return reference;
    }

    @Override
    public String toString() {
        return "OrderDishSavedInRealm{" +
                "reference='" + reference + '\'' +
                '}';
    }
}