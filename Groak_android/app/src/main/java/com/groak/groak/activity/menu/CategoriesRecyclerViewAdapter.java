package com.groak.groak.activity.menu;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.RecyclerView;

import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.localstorage.LocalRestaurant;

import java.util.ArrayList;

public class CategoriesRecyclerViewAdapter extends RecyclerView.Adapter<CategoryCell> {
    Context context;

    GroakCallback callback;

    boolean[] isSelected;

    public CategoriesRecyclerViewAdapter(Context context, GroakCallback callback) {
        this.context = context;
        this.callback = callback;

        isSelected = new boolean[LocalRestaurant.categories.size()];
        if (isSelected.length > 0) isSelected[0] = true;
    }

    public void refresh() {
        isSelected = new boolean[LocalRestaurant.categories.size()];
        if (isSelected.length > 0) isSelected[0] = true;
        this.notifyDataSetChanged();
    }

    public void refresh(int position) {
        isSelected = new boolean[LocalRestaurant.categories.size()];
        if (isSelected.length > position) isSelected[position] = true;
        this.notifyDataSetChanged();
    }

    @NonNull
    @Override
    public CategoryCell onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ConstraintLayout cellLayout = new ConstraintLayout(parent.getContext());
        cellLayout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.MATCH_PARENT));

        return new CategoryCell(cellLayout);
    }

    @Override
    public void onBindViewHolder(@NonNull final CategoryCell holder, final int position) {
        holder.setCategory(LocalRestaurant.categories.get(position).getName());

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                callback.onSuccess(position);

                isSelected = new boolean[LocalRestaurant.categories.size()];
                isSelected[position] = true;
                notifyDataSetChanged();
            }
        });

        if (isSelected[position]) {
            holder.isSelected(true);
        } else {
            holder.isSelected(false);
        }
    }

    @Override
    public int getItemCount() {
        return LocalRestaurant.categories.size();
    }
}
