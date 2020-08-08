package com.groak.groak.restaurantobject.order;

import io.realm.RealmObject;

public class OrderCommentSavedInRealm extends RealmObject {
    private String reference;

    public OrderCommentSavedInRealm() {
        this.reference = "";
    }

    public OrderCommentSavedInRealm(OrderComment comment) {
        this.reference = comment.getReference();
    }

    public OrderCommentSavedInRealm(String reference) {
        this.reference = reference;
    }

    public String getReference() {
        return reference;
    }

    @Override
    public String toString() {
        return "OrderCommentSavedInRealm{" +
                "reference='" + reference + '\'' +
                '}';
    }
}
