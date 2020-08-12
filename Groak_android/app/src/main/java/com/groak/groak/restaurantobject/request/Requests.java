package com.groak.groak.restaurantobject.request;

import com.google.firebase.firestore.DocumentReference;
import com.groak.groak.restaurantobject.TableStatus;

import java.util.ArrayList;
import java.util.Map;

public class Requests {
    private ArrayList<Request> requests;
    private DocumentReference reference;

    public Requests() {
        this.reference = null;
        this.requests = new ArrayList<>();
    }

    public Requests(Map<String, Object> map) {
        this.reference = (DocumentReference)map.get("reference");
        this.requests = new ArrayList<>();

        ArrayList<Map<String, Object>> tempRequests = (ArrayList<Map<String, Object>>)map.get("requests");
        for (Map<String, Object> request: tempRequests) {
            this.requests.add(new Request(request));
        }
    }

    public ArrayList<Request> getRequests() {
        return requests;
    }

    public DocumentReference getReference() {
        return reference;
    }

    @Override
    public String toString() {
        return "Requests{" +
                "requests=" + requests +
                ", reference=" + reference +
                '}';
    }
}
