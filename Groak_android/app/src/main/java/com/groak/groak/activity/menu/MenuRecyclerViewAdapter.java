/**
 * This class is used to represent the menu recyclerview
 */
package com.groak.groak.activity.menu;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.RecyclerView;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.groak.groak.R;
import com.groak.groak.activity.addtocart.AddToCartActivity;
import com.groak.groak.activity.dish.DishActivity;
import com.groak.groak.catalog.Catalog;
import com.groak.groak.restaurantobject.dish.Dish;
import com.groak.groak.restaurantobject.dish.DishSerializer;

public class MenuRecyclerViewAdapter extends RecyclerView.Adapter<DishCell> {

    Context context;
    Dish[] dishes;
    String searchTerm;

    public MenuRecyclerViewAdapter(Context context, Dish[] dishes, String searchTerm) {
        this.context = context;
        this.dishes = dishes;
        this.searchTerm = searchTerm;
    }

    private void refresh() {
        this.notifyDataSetChanged();
    }

    @NonNull
    @Override
    public DishCell onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ConstraintLayout cellLayout = new ConstraintLayout(parent.getContext());
        cellLayout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));

        return new DishCell(cellLayout);
    }

    @Override
    public void onBindViewHolder(@NonNull DishCell holder, final int position) {
        holder.setDish(dishes[position], searchTerm);

        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(Dish.class, new DishSerializer());
        final Gson gson = builder.create();

        /**
         * If any of the following is true then it first shows Dish Activity. Otherwise it jumps straight to
         * the Add To Cart Activity.
         */
        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Dish dish = dishes[position];
                if (dish.isAvailable()) {
                    boolean showDishActivity = false;
                    try {
                        if (dish.getDescription() != null && dish.getDescription().length() != 0)
                            showDishActivity = true;
                        try {
                            if ((Double) dish.getNutrition().get("calories") > 0)
                                showDishActivity = true;
                        } catch (Exception e) {
                            if ((Long) dish.getNutrition().get("calories") > 0)
                                showDishActivity = true;
                        }
                        try {
                            if ((Double) dish.getNutrition().get("fats") > 0)
                                showDishActivity = true;
                        } catch (Exception e) {
                            if ((Long) dish.getNutrition().get("fats") > 0) showDishActivity = true;
                        }
                        try {
                            if ((Double) dish.getNutrition().get("carbs") > 0)
                                showDishActivity = true;
                        } catch (Exception e) {
                            if ((Long) dish.getNutrition().get("carbs") > 0)
                                showDishActivity = true;
                        }
                        try {
                            if ((Double) dish.getNutrition().get("protein") > 0)
                                showDishActivity = true;
                        } catch (Exception e) {
                            if ((Long) dish.getNutrition().get("protein") > 0)
                                showDishActivity = true;
                        }
                        if (!dish.getRestrictions().get("vegan").equals("Not Sure"))
                            showDishActivity = true;
                        if (!dish.getRestrictions().get("vegetarian").equals("Not Sure"))
                            showDishActivity = true;
                        if (!dish.getRestrictions().get("kosher").equals("Not Sure"))
                            showDishActivity = true;
                        if (!dish.getRestrictions().get("glutenFree").equals("Not Sure"))
                            showDishActivity = true;
                    } catch (Exception e) {
                        showDishActivity = false;
                    }

                    Intent intent;
                    if (showDishActivity)
                        intent = new Intent(context, DishActivity.class);
                    else
                        intent = new Intent(context, AddToCartActivity.class);

                    intent.putExtra("dish", gson.toJson(dishes[position]));
                    context.startActivity(intent);
                    ((Activity) context).overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
                } else
                    Catalog.toast(context, dish.getName() + " is currently unavailable");
            }
        });
    }

    @Override
    public int getItemCount() {
        return dishes.length;
    }
}