package com.groak.groak.restaurantobject.dish.cart;

import java.util.ArrayList;

public class Cart {
    private ArrayList<CartDish> dishes;
    private String comment;

    public Cart() {
        this.dishes = new ArrayList<>();
        this.comment = "";
    }

    public Cart(ArrayList<CartDish>  dishes, String comment) {
        this.dishes = new ArrayList<>();
        this.dishes.addAll(dishes);
        this.comment = comment;
    }

    public ArrayList<CartDish> getDishes() {
        return dishes;
    }

    public String getComment() {
        return comment;
    }

    public void addDish(CartDish cartDish) {
        dishes.add(cartDish);
    }
}
