/**
 * Dish
 */
package com.groak.groak.restaurantobject.dish;

import com.google.firebase.firestore.DocumentReference;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.groak.groak.firebase.Firebase;
import com.groak.groak.restaurantobject.dish.dishextra.DishExtra;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class Dish {
    private DocumentReference reference;
    private String name;
    private String imageLink;
    private double price;
    private String shortInfo;
    private String description;
    private ArrayList<String> ingredients;
    private DocumentReference restaurantReference;
    private boolean available;
    private HashMap<String, String> restrictions;
    private HashMap<String, Object> nutrition;
    private ArrayList<DishExtra> extras;

    public Dish() {
        this.reference = null;
        this.name = "";
        this.imageLink = "";
        this.price = 0;
        this.shortInfo = "";
        this.description = "";
        this.ingredients = new ArrayList<>();
        this.restaurantReference = null;
        this.available = false;
        this.restrictions = new HashMap<>();
        this.nutrition = new HashMap<>();
        this.extras = new ArrayList<>();
    }

    public Dish(Map<String, Object> map) {
        this.reference = (DocumentReference)map.get("reference");
        this.name = (String)map.get("name");
        this.imageLink = (String)map.get("image");
        try {
            this.price = (double) map.get("price");
        } catch (ClassCastException e) {
            this.price = (long) map.get("price");
        }
        this.shortInfo = (String)map.get("shortInfo");
        this.description = (String)map.get("description");
        this.ingredients = (ArrayList<String>)map.get("ingredients");
        this.restaurantReference = (DocumentReference) map.get("restaurantReference");
        this.available = (boolean)map.get("available");
        this.restrictions = (HashMap<String, String>) map.get("restrictions");
        this.nutrition = (HashMap<String, Object>) map.get("nutrition");
        this.extras = new ArrayList<>();
        ArrayList<Map<String, Object>> tempExtras = (ArrayList<Map<String, Object>>)map.get("extras");
        for (Map<String, Object> extra: tempExtras) {
            this.extras.add(new DishExtra(extra));
        }
    }

    public Dish(JsonObject json) {
        Gson gson = new Gson();

        if (json.get("reference") != null)
            this.reference = Firebase.firebase.db.document(json.get("reference").getAsString());
        if (json.get("name") != null)
            this.name = json.get("name").getAsString();
        if (json.get("imageLink") != null)
            this.imageLink = json.get("imageLink").getAsString();
        if (json.get("price") != null)
            this.price = json.get("price").getAsDouble();
        if (json.get("shortInfo") != null)
            this.shortInfo = json.get("shortInfo").getAsString();
        if (json.get("description") != null)
            this.description = json.get("description").getAsString();
        if (json.get("ingredients") != null)
            this.ingredients = gson.fromJson(json.get("ingredients").getAsJsonArray(), new TypeToken<ArrayList<String>>(){}.getType());
        if (json.get("restaurantReference") != null)
            this.restaurantReference = Firebase.firebase.db.document(json.get("restaurantReference").getAsString());
        if (json.get("available") != null)
            this.available = json.get("available").getAsBoolean();
        if (json.get("restrictions") != null)
            this.restrictions = gson.fromJson(json.get("restrictions").getAsJsonObject(), new TypeToken<HashMap<String, String>>(){}.getType());
        if (json.get("nutrition") != null)
            this.nutrition = gson.fromJson(json.get("nutrition").getAsJsonObject(), new TypeToken<HashMap<String, Double>>(){}.getType());
        if (json.get("extras") != null)
            this.extras = gson.fromJson(json.get("extras").getAsJsonArray(), new TypeToken<ArrayList<DishExtra>>(){}.getType());
    }

    public DocumentReference getReference() {
        return reference;
    }
    public String getName() {
        return name;
    }
    public String getImageLink() {
        return imageLink;
    }
    public double getPrice() {
        return price;
    }
    public String getShortInfo() {
        return shortInfo;
    }
    public String getDescription() {
        return description;
    }
    public ArrayList<String> getIngredients() {
        return ingredients;
    }
    public DocumentReference getRestaurantReference() {
        return restaurantReference;
    }
    public boolean isAvailable() {
        return available;
    }
    public HashMap<String, String> getRestrictions() {
        return restrictions;
    }
    public HashMap<String, Object> getNutrition() {
        return nutrition;
    }
    public ArrayList<DishExtra> getExtras() {
        return extras;
    }

    public String toString() {
        String str = "";

        str += "Reference: " + reference + "\n";
        str += "Name: " + name + "\n";
        str += "Image Link: " + imageLink + "\n";
        str += "Price: " + price + "\n";
        str += "Short Info: " + shortInfo + "\n";
        str += "Description: " + description + "\n";
        str += "Ingredients: " + ingredients + "\n";
        str += "Available: " + available + "\n";
        str += "Restrictions: " + restrictions + "\n";
        str += "Nutrition: " + nutrition + "\n";
        str += "Extras: " + extras.toString() + "\n";

        return str;
    }
}