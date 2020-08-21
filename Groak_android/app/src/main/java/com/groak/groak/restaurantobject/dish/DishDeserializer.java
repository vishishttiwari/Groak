/**
 * DishDeserializer
 */
package com.groak.groak.restaurantobject.dish;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;

import java.lang.reflect.Type;

public class DishDeserializer implements JsonDeserializer<Dish> {
    @Override
    public Dish deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        return new Dish(json.getAsJsonObject());
    }
}