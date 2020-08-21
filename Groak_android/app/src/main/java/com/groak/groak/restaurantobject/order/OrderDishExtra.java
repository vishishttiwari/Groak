/**
 * OrderDishExtra
 */
package com.groak.groak.restaurantobject.order;

import com.groak.groak.restaurantobject.cart.CartDishExtra;
import com.groak.groak.restaurantobject.cart.CartDishExtraOption;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class OrderDishExtra {
    private String title;
    private ArrayList<OrderDishExtraOption> options;

    public OrderDishExtra() {
        this.title = "";
        this.options = new ArrayList<>();
    }

    public OrderDishExtra(Map<String, Object> map) {
        this.title = (String)map.get("title");

        this.options = new ArrayList<>();
        ArrayList<Map<String, Object>> tempOptions = (ArrayList<Map<String, Object>>)map.get("options");
        for (Map<String, Object> option: tempOptions)
            this.options.add(new OrderDishExtraOption(option));
    }

    public OrderDishExtra(CartDishExtra extra) {
        this.title = extra.getTitle();

        this.options = new ArrayList<>();
        for (CartDishExtraOption option: extra.getOptions())
            this.options.add(new OrderDishExtraOption(option));
    }

    public HashMap<String, Object> getDictionary() {
        HashMap<String, Object> dictionary = new HashMap<>();

        dictionary.put("title", title);
        ArrayList<HashMap<String, Object>> optionsDict = new ArrayList<>();
        for (OrderDishExtraOption option: options)
            optionsDict.add(option.getDictionary());
        dictionary.put("options", optionsDict);

        return dictionary;
    }

    public String getTitle() {
        return title;
    }
    public ArrayList<OrderDishExtraOption> getOptions() {
        return options;
    }

    @Override
    public String toString() {
        return "OrderDishExtra{" +
                "title='" + title + '\'' +
                ", options=" + options +
                '}';
    }
}
