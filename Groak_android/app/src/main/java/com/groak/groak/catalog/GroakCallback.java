package com.groak.groak.catalog;

public interface GroakCallback {
    void onSuccess(Object object);
    void onFailure(Exception e);
}