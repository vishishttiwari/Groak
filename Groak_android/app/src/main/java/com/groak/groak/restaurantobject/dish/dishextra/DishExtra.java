/**
 * DishExtra
 */
package com.groak.groak.restaurantobject.dish.dishextra;

import com.google.gson.JsonObject;
import com.groak.groak.restaurantobject.dish.dishextra.dishextraoption.DishExtraOption;

import java.util.ArrayList;
import java.util.Map;

public class DishExtra {
    private String title;
    private boolean multipleSelections;
    private long minOptionsSelect;
    private long maxOptionsSelect;
    private ArrayList<DishExtraOption> options;

    public DishExtra() {
        this.title = "";
        this.multipleSelections = false;
        this.minOptionsSelect = -1;
        this.maxOptionsSelect = -1;
        this.options = new ArrayList<>();
    }

    public DishExtra(Map<String, Object> map) {
        this.title = (String)map.get("title");
        this.multipleSelections = (boolean)map.get("multipleSelections");
        this.minOptionsSelect = (long)map.get("minOptionsSelect");
        this.maxOptionsSelect = (long)map.get("maxOptionsSelect");
        this.options = new ArrayList<>();

        ArrayList<Map<String, Object>> tempOptions = (ArrayList<Map<String, Object>>)map.get("options");
        for (Map<String, Object> option: tempOptions) {
            this.options.add(new DishExtraOption(option));
        }
    }

    public DishExtra(JsonObject json) {
        if (json.get("title") != null)
            this.title = json.get("title").getAsString();
        if (json.get("multipleSelections") != null)
            this.multipleSelections = json.get("multipleSelections").getAsBoolean();
        if (json.get("minOptionsSelect") != null)
            this.minOptionsSelect = json.get("minOptionsSelect").getAsLong();
        if (json.get("maxOptionsSelect") != null)
            this.maxOptionsSelect = json.get("maxOptionsSelect").getAsLong();
    }

    public String getTitle() {
        return title;
    }
    public boolean isMultipleSelections() {
        return multipleSelections;
    }
    public long getMinOptionsSelect() {
        return minOptionsSelect;
    }
    public long getMaxOptionsSelect() {
        return maxOptionsSelect;
    }
    public ArrayList<DishExtraOption> getOptions() {
        return options;
    }

    public String toString() {
        String str = "";

        str += "Title: " + title + "\n";
        str += "Multiple Selections: " + multipleSelections + "\n";
        str += "Min Options Selected: " + minOptionsSelect + "\n";
        str += "Max Options Selected: " + maxOptionsSelect + "\n";
        str += "Options: " + options.toString() + "\n";

        return str;
    }
}