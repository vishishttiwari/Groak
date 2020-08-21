/**
 * This class is used for saving Order Comment in Realm
 */
package com.groak.groak.restaurantobject.order;

import java.util.Date;

import io.realm.RealmObject;

public class OrderCommentSavedInRealm extends RealmObject {
    private String reference;
    private Date created;

    public OrderCommentSavedInRealm() {
        this.reference = "";
        this.created = new Date();
    }

    public OrderCommentSavedInRealm(OrderComment comment) {
        this.reference = comment.getReference();
        this.created = new Date();
    }

    public OrderCommentSavedInRealm(String reference) {
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
        return "OrderCommentSavedInRealm{" +
                "reference='" + reference + '\'' +
                ", created=" + created +
                '}';
    }
}
