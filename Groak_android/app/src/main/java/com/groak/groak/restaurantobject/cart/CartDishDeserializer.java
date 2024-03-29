/**
 * Used for deserializing cart
 */
package com.groak.groak.restaurantobject.cart;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;

import java.lang.reflect.Type;

public class CartDishDeserializer implements JsonDeserializer<CartDish> {
    @Override
    public CartDish deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        return new CartDish(json.getAsJsonObject());
    }
}