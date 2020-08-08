package com.groak.groak.activity.order;

import android.content.Context;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.RecyclerView;

import com.groak.groak.localstorage.LocalRestaurant;

public class OrderRecyclerViewAdapter extends RecyclerView.Adapter<OrderDishCell> {

    Context context;
    boolean tableOrder = true;

    public OrderRecyclerViewAdapter(Context context) {
        this.context = context;
    }

    public void refresh(boolean tableOrder) {
        this.tableOrder = tableOrder;
        this.notifyDataSetChanged();
    }

    @NonNull
    @Override
    public OrderDishCell onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ConstraintLayout cellLayout = new ConstraintLayout(parent.getContext());
        cellLayout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));

        return new OrderDishCell(cellLayout);
    }

    @Override
    public void onBindViewHolder(@NonNull OrderDishCell holder, final int position) {
        if (tableOrder)
            holder.setDish(LocalRestaurant.order.getDishes().get(position));
        else
            holder.setDish(LocalRestaurant.getLocalOrderDish(position));
    }

    @Override
    public int getItemCount() {
        if (tableOrder)
            return LocalRestaurant.order.getDishes().size();
        else
            return LocalRestaurant.getLocalOrderDishesCount();
    }
}
