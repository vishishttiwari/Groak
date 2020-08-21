/**
 * DishSerializer
 */
package com.groak.groak.restaurantobject.dish;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

import java.lang.reflect.Type;

public class DishSerializer implements JsonSerializer<Dish> {
    @Override
    public JsonElement serialize(Dish src, Type typeOfSrc, JsonSerializationContext context) {
        Gson gson = new Gson();

        JsonObject json = new JsonObject();
        json.addProperty("reference", src.getReference().getPath());
        json.addProperty("name", src.getName());
        json.addProperty("imageLink", src.getImageLink());
        json.addProperty("price", src.getPrice());
        json.addProperty("shortInfo", src.getShortInfo());
        json.addProperty("description", src.getDescription());
        JsonElement jsonElement = gson.toJsonTree(src.getIngredients());
        json.add("ingredients", jsonElement);
        json.addProperty("restaurantReference", src.getRestaurantReference().getPath());
        json.addProperty("available", src.isAvailable());
        JsonElement jsonElement1 = gson.toJsonTree(src.getRestrictions());
        json.add("restrictions", jsonElement1);
        JsonElement jsonElement2 = gson.toJsonTree(src.getNutrition());
        json.add("nutrition", jsonElement2);
        json.add("extras", gson.toJsonTree(src.getExtras()));

        return json;
    }
}
