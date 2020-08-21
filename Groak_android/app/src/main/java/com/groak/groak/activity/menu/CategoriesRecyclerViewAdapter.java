/**
 * This class is used to represent the categories recycler view in menu screen.
 */
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

public class CategoriesRecyclerViewAdapter extends RecyclerView.Adapter<CategoryCell> {
    Context context;

    GroakCallback callback;

    /**
     * This variable is used to show which one is supposed to be selected. The value trie in the array
     * will be shown as selected
     */
    boolean[] isSelected;

    public CategoriesRecyclerViewAdapter(Context context, GroakCallback callback) {
        this.context = context;
        this.callback = callback;

        isSelected = new boolean[LocalRestaurant.categories.size()];
        if (isSelected.length > 0) isSelected[0] = true;
    }

    /**
     * This function is used reset the recyclerview and select the first element
     */
    public void refresh() {
        isSelected = new boolean[LocalRestaurant.categories.size()];
        if (isSelected.length > 0) isSelected[0] = true;
        this.notifyDataSetChanged();
    }

    /**
     * This function is used reset the recyclerview and select the position element
     *
     * @param position
     */
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

    /**
     * This function makes sure that whichever element of array is selected is shown as theme colored
     *
     * @param holder
     * @param position
     */
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
