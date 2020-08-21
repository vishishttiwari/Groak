/**
 * CartDish
 */
package com.groak.groak.restaurantobject.cart;

import com.google.firebase.firestore.DocumentReference;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.groak.groak.catalog.Catalog;
import com.groak.groak.firebase.Firebase;
import com.groak.groak.restaurantobject.dish.Dish;
import com.groak.groak.restaurantobject.dish.dishextra.DishExtra;

import java.util.ArrayList;

public class CartDish {
    private String name;
    private DocumentReference dishReference;
    private double price;
    private int quantity;
    private double pricePerItem;
    private ArrayList<CartDishExtra> extras;

    public CartDish() {
        this.name = "";
        this.dishReference = null;
        this.price = -1;
        this.quantity = -1;
        this.pricePerItem = -1;
        this.extras = new ArrayList<>();
    }

    public CartDish(Dish dish) {
        this.name = dish.getName();
        this.dishReference = dish.getReference();
        this.price = dish.getPrice();
        this.quantity = 1;
        this.pricePerItem = dish.getPrice();
        this.extras = new ArrayList<>();
        for (DishExtra extra: dish.getExtras())
            this.extras.add(new CartDishExtra(extra));
    }

    public CartDish(JsonObject json) {
        Gson gson = new Gson();

        if (json.get("reference") != null)
            this.dishReference = Firebase.firebase.db.document(json.get("reference").getAsString());
        if (json.get("name") != null)
            this.name = json.get("name").getAsString();
        if (json.get("price") != null)
            this.price = json.get("price").getAsDouble();
        if (json.get("quantity") != null)
            this.quantity = json.get("quantity").getAsInt();
        if (json.get("priceperitem") != null)
            this.pricePerItem = json.get("priceperitem").getAsDouble();
        if (json.get("extras") != null)
            this.extras = gson.fromJson(json.get("extras").getAsJsonArray(), new TypeToken<ArrayList<CartDishExtra>>(){}.getType());
    }

    public CartDish(String name, DocumentReference dishReference, int quantity, double pricePerItem, ArrayList<CartDishExtra> extras) {
        this.name = name;
        this.dishReference = dishReference;
        this.price = Catalog.calculateTotalPriceOfDish(pricePerItem, quantity);
        this.quantity = quantity;
        this.pricePerItem = pricePerItem;
        this.extras = extras;
    }

    public CartDish(CartDish cartDish) {
        this.name = cartDish.getName();
        this.dishReference = cartDish.getDishReference();
        this.price = cartDish.getPrice();
        this.quantity = cartDish.getQuantity();
        this.pricePerItem = cartDish.getPricePerItem();
        this.extras = cartDish.getExtras();
    }

    public String getName() {
        return name;
    }
    public DocumentReference getDishReference() {
        return dishReference;
    }
    public double getPrice() {
        return price;
    }
    public int getQuantity() {
        return quantity;
    }
    public double getPricePerItem() {
        return pricePerItem;
    }
    public ArrayList<CartDishExtra> getExtras() {
        return extras;
    }

    public void addExtra(CartDishExtra extra) {
        extras.add(extra);
    }
}
