package com.groak.groak.localstorage;

import com.groak.groak.restaurantobject.Restaurant;
import com.groak.groak.restaurantobject.dish.cart.Cart;
import com.groak.groak.restaurantobject.dish.cart.CartDish;

public class LocalRestaurant {
    public static Restaurant restaurant = null;

    public static Cart cart = new Cart();

    public static double calculateCartTotalPrice() {
        double price = 0;
        for (CartDish dish: cart.getDishes())
            price += dish.getPrice();
        return price;
    }
}
