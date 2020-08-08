package com.groak.groak.restaurantobject.cart;

import com.groak.groak.restaurantobject.dish.dishextra.dishextraoption.DishExtraOption;

public class CartDishExtraOption {
    private String title;
    private double price;
    private int optionIndex;

    public CartDishExtraOption() {
        this.title = "";
        this.price = -1;
        this.optionIndex = -1;
    }

    public CartDishExtraOption(DishExtraOption option, int optionIndex) {
        this.title = option.getTitle();
        this.price = option.getPrice();
        this.optionIndex = optionIndex;
    }

    public CartDishExtraOption(String title, double price, int optionIndex) {
        this.title = title;
        this.price = price;
        this.optionIndex = optionIndex;
    }

    public CartDishExtraOption(CartDishExtraOption option) {
        this.title = option.getTitle();
        this.price = option.getPrice();
        this.optionIndex = option.getOptionIndex();
    }

    public String getTitle() {
        return title;
    }
    public double getPrice() {
        return price;
    }
    public int getOptionIndex() {
        return optionIndex;
    }
}
