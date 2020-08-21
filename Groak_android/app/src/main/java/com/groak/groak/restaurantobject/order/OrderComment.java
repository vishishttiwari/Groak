/**
 * OrderComment
 */
package com.groak.groak.restaurantobject.order;

import com.google.firebase.Timestamp;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class OrderComment {
    private String reference;
    private String comment;
    private Timestamp created;
    private boolean local;

    public OrderComment() {
        this.reference = null;
        this.comment = "";
        this.created = null;
        this.local = false;
    }

    public OrderComment(Map<String, Object> map) {
        reference = (String)map.get("reference");
        comment = (String)map.get("comment");
        created = (Timestamp) map.get("created");
        local = false;
    }

    public OrderComment(String comment) {
        this.reference = UUID.randomUUID().toString();
        this.comment = comment;
        this.created = Timestamp.now();
        this.local = false;
    }

    public boolean success() {
        if (reference == null || reference.length() == 0) return false;
        return true;
    }

    public HashMap<String, Object> getDictionary() {
        HashMap<String, Object> dictionary = new HashMap<>();
        dictionary.put("reference", reference);
        dictionary.put("comment", comment);
        dictionary.put("created", created);

        return dictionary;
    }

    public String getReference() {
        return reference;
    }
    public String getComment() {
        return comment;
    }
    public Timestamp getCreated() {
        return created;
    }
    public boolean isLocal() {
        return local;
    }

    public void setLocal(boolean local) {
        this.local = local;
    }

    @Override
    public String toString() {
        return "OrderComment{" +
                "reference='" + reference + '\'' +
                ", comment='" + comment + '\'' +
                ", created=" + created +
                ", local=" + local +
                '}';
    }
}
