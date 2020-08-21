/**
 * RestaurantSerializer
 */
package com.groak.groak.restaurantobject.restaurant;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

import java.lang.reflect.Type;

public class RestaurantSerializer implements JsonSerializer<Restaurant> {
    @Override
    public JsonElement serialize(Restaurant src, Type typeOfSrc, JsonSerializationContext context) {
        Gson gson = new Gson();

        JsonObject json = new JsonObject();
        json.addProperty("reference", src.getReference().getPath());
        json.addProperty("name", src.getName());
        JsonElement jsonElement = gson.toJsonTree(src.getType());
        json.add("type", jsonElement);
        json.addProperty("logo", src.getLogo());
        json.addProperty("salesTax", src.getSalesTax());
        JsonElement jsonElement1 = gson.toJsonTree(src.getAddress());
        json.add("address", jsonElement1);
        json.addProperty("latitude", src.getLatitude());
        json.addProperty("longitude", src.getLongitude());
        json.addProperty("covidGuidelines", src.getCovidGuidelines());
        json.addProperty("covidMessage", src.getCovidMessage());

        return json;
    }
}
