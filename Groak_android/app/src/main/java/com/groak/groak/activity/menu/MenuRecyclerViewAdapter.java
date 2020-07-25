package com.groak.groak.activity.menu;

import android.app.Activity;
import android.app.ActivityOptions;
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
import com.groak.groak.activity.dish.DishActivity;
import com.groak.groak.restaurantobject.dish.Dish;
import com.groak.groak.restaurantobject.dish.DishSerializer;

public class MenuRecyclerViewAdapter extends RecyclerView.Adapter<DishCell> {

    Context context;
    Dish[] dishes;

    public MenuRecyclerViewAdapter(Context context, Dish[] dishes) {
        this.context = context;
        this.dishes = dishes;
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
        holder.setDish(dishes[position]);

        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(Dish.class, new DishSerializer());
        final Gson gson = builder.create();

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent =  new Intent(context, DishActivity.class);

                intent.putExtra("dish", gson.toJson(dishes[position]));
                context.startActivity(intent);
                ((Activity)context).overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
            }
        });
    }

    @Override
    public int getItemCount() {
        return dishes.length;
    }
}