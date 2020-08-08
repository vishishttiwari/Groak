package com.groak.groak.restaurantobject;

import com.google.firebase.Timestamp;
import com.google.firebase.firestore.DocumentReference;

import java.util.Map;

public class Table {
    private String name;
    private DocumentReference reference;
    private DocumentReference originalReference;
    private DocumentReference orderReference;
    private DocumentReference requestReference;
    private DocumentReference restaurantReference;
    private TableStatus status;
    private boolean newRequest;
    private Timestamp serveTime;

    public Table() {
        this.name = "";
        this.reference = null;
        this.originalReference = null;
        this.orderReference = null;
        this.requestReference = null;
        this.restaurantReference = null;
        this.status = TableStatus.available;
        this.newRequest = false;
        this.serveTime = null;
    }

    public Table(Map<String, Object> map) {
        this.name = (String)map.get("name");
        this.reference = (DocumentReference)map.get("reference");
        this.originalReference = (DocumentReference)map.get("originalReference");
        this.orderReference = (DocumentReference)map.get("orderReference");
        this.requestReference = (DocumentReference)map.get("requestReference");
        this.restaurantReference = (DocumentReference)map.get("restaurantReference");
        this.status = TableStatus.fromString((String)map.get("status"));
        this.newRequest = (Boolean)map.get("newRequest");
        this.serveTime = (Timestamp)map.get("serveTime");
    }

    public String getName() {
        return name;
    }
    public DocumentReference getReference() {
        return reference;
    }
    public DocumentReference getOriginalReference() {
        return originalReference;
    }
    public DocumentReference getOrderReference() {
        return orderReference;
    }
    public DocumentReference getRequestReference() {
        return requestReference;
    }
    public DocumentReference getRestaurantReference() {
        return restaurantReference;
    }
    public TableStatus getStatus() {
        return status;
    }
    public boolean isNewRequest() {
        return newRequest;
    }
    public Timestamp getServeTime() {
        return serveTime;
    }

    @Override
    public String toString() {
        return "Table{" +
                "name='" + name + '\'' +
                ", reference=" + reference +
                ", originalReference=" + originalReference +
                ", orderReference=" + orderReference +
                ", requestReference=" + requestReference +
                ", restaurantReference=" + restaurantReference +
                ", status=" + status +
                ", newRequest=" + newRequest +
                ", serveTime=" + serveTime +
                '}';
    }
}