/**
 * OrderDishExtraOption
 */
package com.groak.groak.restaurantobject.order;

import com.groak.groak.restaurantobject.cart.CartDishExtraOption;

import java.util.HashMap;
import java.util.Map;

public class OrderDishExtraOption {
    private String title;
    private double price;

    public OrderDishExtraOption() {
        this.title = "";
        this.price = -1;
    }

    public OrderDishExtraOption(Map<String, Object> map) {
        this.title = (String)map.get("title");
        this.price = (Double )map.get("price");
    }

    public OrderDishExtraOption(CartDishExtraOption option) {
        this.title = option.getTitle();
        this.price = option.getPrice();
    }

    public HashMap<String, Object> getDictionary() {
        HashMap<String, Object> dictionary = new HashMap<>();

        dictionary.put("title", title);
        dictionary.put("price", price);

        return dictionary;
    }

    public String getTitle() {
        return title;
    }
    public double getPrice() {
        return price;
    }

    @Override
    public String toString() {
        return "OrderDishExtraOption{" +
                "title='" + title + '\'' +
                ", price=" + price +
                '}';
    }
}
