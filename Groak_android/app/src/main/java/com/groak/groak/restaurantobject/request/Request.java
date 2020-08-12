package com.groak.groak.restaurantobject.request;

import com.google.firebase.Timestamp;

import java.util.HashMap;
import java.util.Map;

public class Request {
    private Timestamp created;
    private boolean createdByUser;
    private String request;

    public Request() {
        this.created = Timestamp.now();
        this.createdByUser = false;
        this.request = "";
    }

    public Request(String request) {
        this.request = request;
        this.created = Timestamp.now();
        this.createdByUser = true;
    }

    public Request(Map<String, Object> map) {
        this.created = (Timestamp) map.get("created");
        this.createdByUser = (boolean)map.get("createdByUser");
        this.request = (String) map.get("request");
    }

    public Timestamp getCreated() {
        return created;
    }

    public boolean isCreatedByUser() {
        return createdByUser;
    }

    public String getRequest() {
        return request;
    }

    public HashMap<String, Object> getDictionary() {
        HashMap<String, Object> dictionary = new HashMap<>();

        dictionary.put("request", request);
        dictionary.put("createdByUser", createdByUser);
        dictionary.put("created", created);

        return dictionary;
    }

    @Override
    public String toString() {
        return "Request{" +
                "created=" + created +
                ", createdByUser=" + createdByUser +
                ", request='" + request + '\'' +
                '}';
    }
}
