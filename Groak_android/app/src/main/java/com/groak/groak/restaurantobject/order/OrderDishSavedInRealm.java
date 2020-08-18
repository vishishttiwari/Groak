package com.groak.groak.restaurantobject.order;

import java.util.Date;

import io.realm.RealmObject;

public class OrderDishSavedInRealm extends RealmObject {
    private String reference;
    private Date created;

    public OrderDishSavedInRealm() {
        this.reference = "";
        this.created = new Date();
    }

    public OrderDishSavedInRealm(OrderDish dish) {
        this.reference = dish.getReference();
        this.created = new Date();
    }

    public OrderDishSavedInRealm(String reference) {
        this.reference = reference;
        this.created = new Date();
    }

    public String getReference() {
        return reference;
    }
    public Date getCreated() {
        return created;
    }

    @Override
    public String toString() {
        return "OrderDishSavedInRealm{" +
                "reference='" + reference + '\'' +
                ", created=" + created +
                '}';
    }
}