/**
 * Used for serializing CartDish
 */
package com.groak.groak.restaurantobject.cart;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

import java.lang.reflect.Type;

public class CartDishSerializer implements JsonSerializer<CartDish> {
    @Override
    public JsonElement serialize(CartDish src, Type typeOfSrc, JsonSerializationContext context) {
        Gson gson = new Gson();

        JsonObject json = new JsonObject();
        json.addProperty("reference", src.getDishReference().getPath());
        json.addProperty("name", src.getName());
        json.addProperty("price", src.getPrice());
        json.addProperty("quantity", src.getQuantity());
        json.addProperty("price", src.getPrice());
        json.addProperty("priceperitem", src.getPricePerItem());
        JsonElement jsonElement = gson.toJsonTree(src.getExtras());
        json.add("extras", jsonElement);

        return json;
    }
}
