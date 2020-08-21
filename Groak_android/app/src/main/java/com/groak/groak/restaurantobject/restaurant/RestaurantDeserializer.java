/**
 * RestaurantDeserializer
 */
package com.groak.groak.restaurantobject.restaurant;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;

import java.lang.reflect.Type;

public class RestaurantDeserializer implements JsonDeserializer<Restaurant> {
    @Override
    public Restaurant deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        return new Restaurant(json.getAsJsonObject());
    }
}