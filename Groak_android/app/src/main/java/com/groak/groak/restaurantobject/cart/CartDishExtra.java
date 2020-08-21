/**
 * CartDishExtra
 */
package com.groak.groak.restaurantobject.cart;

import com.groak.groak.restaurantobject.dish.dishextra.DishExtra;
import com.groak.groak.restaurantobject.dish.dishextra.dishextraoption.DishExtraOption;

import java.util.ArrayList;

public class CartDishExtra {
    private String title;
    private ArrayList<CartDishExtraOption> options;

    public CartDishExtra() {
        this.title = "";
        this.options = new ArrayList<>();
    }

    public CartDishExtra(DishExtra extra) {
        this.title = extra.getTitle();
        this.options = new ArrayList<>();
        for (int i = 0; i < extra.getOptions().size(); i++) {
            DishExtraOption option = extra.getOptions().get(i);
            this.options.add(new CartDishExtraOption(option, i));
        }
    }

    public CartDishExtra(String title, ArrayList<CartDishExtraOption> options) {
        this.title = title;
        this.options = options;
    }

    public CartDishExtra(String title) {
        this.title = title;
        this.options = new ArrayList<>();
    }

    public CartDishExtra(CartDishExtra extra) {
        this.title = extra.getTitle();
        this.options = extra.getOptions();
    }

    public String getTitle() {
        return title;
    }
    public ArrayList<CartDishExtraOption> getOptions() {
        return options;
    }
}
