/**
 * DishExtraOption
 */
package com.groak.groak.restaurantobject.dish.dishextra.dishextraoption;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import java.util.Map;

public class DishExtraOption {
    private String title;
    private double price;

    public DishExtraOption() {
        this.title = "";
        this.price = -1;
    }

    public DishExtraOption(Map<String, Object> map) {
        this.title = (String)map.get("title");
        try {
            this.price = (double) map.get("price");
        } catch (ClassCastException e) {
            this.price = (long) map.get("price");
        }
    }

    public DishExtraOption(JsonObject json) {
        Gson gson = new Gson();

        if (json.get("title") != null)
            this.title = json.get("title").getAsString();
        if (json.get("price") != null)
            this.price = json.get("price").getAsDouble();
    }

    public String getTitle() {
        return title;
    }
    public double getPrice() {
        return price;
    }

    public String toString() {
        String str = "";

        str += "Title: " + title + "\n";
        str += "Price: " + price + "\n";

        return str;
    }
}