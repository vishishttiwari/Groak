package com.groak.groak.activity.restaurant;

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
import com.groak.groak.activity.camera.CameraActivity;
import com.groak.groak.restaurantobject.restaurant.Restaurant;
import com.groak.groak.restaurantobject.restaurant.RestaurantSerializer;

import java.util.ArrayList;

public class RestaurantRecyclerViewAdapter extends RecyclerView.Adapter<RestaurantCell> {
    Context context;
    ArrayList<Restaurant> restaurants;
    String searchTerm;

    public RestaurantRecyclerViewAdapter(Context context, ArrayList<Restaurant> restaurants, String searchTerm) {
        this.context = context;
        this.restaurants = restaurants;
        this.searchTerm = searchTerm;
    }

    public void refresh(ArrayList<Restaurant> restaurants) {
        this.restaurants = restaurants;
        this.notifyDataSetChanged();
    }

    @NonNull
    @Override
    public RestaurantCell onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ConstraintLayout cellLayout = new ConstraintLayout(parent.getContext());
        cellLayout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));

        return new RestaurantCell(context, cellLayout);
    }

    @Override
    public void onBindViewHolder(@NonNull RestaurantCell holder, final int position) {
        holder.setRestaurant(restaurants.get(position));

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                GsonBuilder builder = new GsonBuilder();
                builder.registerTypeAdapter(Restaurant.class, new RestaurantSerializer());
                final Gson gson = builder.create();

                Intent intent = new Intent(context, CameraActivity.class);

                intent.putExtra("restaurant", gson.toJson(restaurants.get(position)));
                context.startActivity(intent);
            }
        });
    }

    @Override
    public int getItemCount() {
        return restaurants.size();
    }
}