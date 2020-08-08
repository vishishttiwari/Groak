package com.groak.groak.activity.order;

import android.content.Context;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.RecyclerView;

import com.groak.groak.localstorage.LocalRestaurant;

public class InstructionsRecyclerViewAdapter extends RecyclerView.Adapter<InstructionDishCell> {

    Context context;
    boolean tableOrder = true;

    public InstructionsRecyclerViewAdapter(Context context) {
        this.context = context;
    }

    public void refresh(boolean tableOrder) {
        this.tableOrder = tableOrder;
        this.notifyDataSetChanged();
    }

    @NonNull
    @Override
    public InstructionDishCell onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ConstraintLayout cellLayout = new ConstraintLayout(parent.getContext());
        cellLayout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));

        return new InstructionDishCell(cellLayout);
    }

    @Override
    public void onBindViewHolder(@NonNull InstructionDishCell holder, final int position) {
        if (tableOrder)
            holder.setComment(LocalRestaurant.order.getComments().get(position));
        else
            holder.setComment(LocalRestaurant.getLocalOrderComment(position));

    }

    @Override
    public int getItemCount() {
        if (tableOrder)
            return LocalRestaurant.order.getComments().size();
        else
            return LocalRestaurant.getLocalOrderCommentsCount();
    }
}
