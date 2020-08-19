package com.groak.groak.restaurantobject.session;

import java.util.Date;
import java.util.UUID;

import io.realm.RealmObject;

public class SessionId extends RealmObject {
    private String sessionId;
    private Date created;

    public SessionId() {
        this.sessionId = UUID.randomUUID().toString();
        this.created = new Date();
    }

    public String getSessionId() {
        return sessionId;
    }
    public Date getCreated() {
        return created;
    }
}
