package com.groak.groak.activity.cart;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.RecyclerView;

import com.groak.groak.R;
import com.groak.groak.activity.cart.cartdetails.CartDetailsActivity;
import com.groak.groak.localstorage.LocalRestaurant;

public class CartRecyclerViewAdapter extends RecyclerView.Adapter<CartDishCell> {

    Context context;

    public CartRecyclerViewAdapter(Context context) {
        this.context = context;
    }

    public void refresh() {
        this.notifyDataSetChanged();
    }

    @NonNull
    @Override
    public CartDishCell onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ConstraintLayout cellLayout = new ConstraintLayout(parent.getContext());
        cellLayout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));

        return new CartDishCell(cellLayout);
    }

    @Override
    public void onBindViewHolder(@NonNull CartDishCell holder, final int position) {
        holder.setDish(LocalRestaurant.cart.getDishes().get(position));

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent =  new Intent(context, CartDetailsActivity.class);

                intent.putExtra("position", position);
                context.startActivity(intent);
                ((Activity)context).overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
            }
        });
    }

    @Override
    public int getItemCount() {
        return LocalRestaurant.cart.getDishes().size();
    }
}
