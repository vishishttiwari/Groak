/**
 * This is for each of the recycler view in the add to cart activity
 */
package com.groak.groak.activity.addtocart;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.RecyclerView;

import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.restaurantobject.cart.CartDishExtra;
import com.groak.groak.restaurantobject.cart.CartDishExtraOption;
import com.groak.groak.restaurantobject.dish.dishextra.DishExtra;
import com.groak.groak.restaurantobject.dish.dishextra.dishextraoption.DishExtraOption;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class AddToCartRecyclerViewAdapter extends RecyclerView.Adapter<OptionCell> {

    private Context context;
    private DishExtra extra;
    private GroakCallback groakCallback;
    private ArrayList<DishExtraOption> options;
    private HashMap<Integer, CartDishExtraOption> optionsSelected;

    public AddToCartRecyclerViewAdapter(Context context, DishExtra extra, GroakCallback callback) {
        this.context = context;
        this.extra = extra;
        this.groakCallback = callback;
        this.options = extra.getOptions();
        this.optionsSelected = new HashMap<>();
    }

    private void getRow(int position) {
        getItemId(position);
    }

    private void refresh() {
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public OptionCell onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ConstraintLayout cellLayout = new ConstraintLayout(parent.getContext());
        cellLayout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));

        return new OptionCell(cellLayout);
    }

    /**
     * In this function, if more than maximum allowed options are tapped then either there is an alert or it will
     * deselect the other option
     *
     * @param holder
     * @param position
     */
    @Override
    public void onBindViewHolder(@NonNull final OptionCell holder, final int position) {
        holder.setOption(options.get(position), extra.isMultipleSelections());

        if (optionsSelected.get(position) != null)
            holder.select(true);
        else
            holder.select(false);

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (extra.isMultipleSelections()) {
                    if (optionsSelected.size() >= extra.getMaxOptionsSelect()) {
                        holder.select(false);
                        Catalog.toast(context, "Up to " + extra.getMaxOptionsSelect() + " option(s) required for " + extra.getTitle());
                    } else {
                        optionsSelected.put(position, new CartDishExtraOption(options.get(position), position));
                        groakCallback.onSuccess(options.get(position).getPrice());
                    }
                } else {
                    double newPrice = 0;
                    if (optionsSelected.size() > 0) {
                        for (Map.Entry<Integer, CartDishExtraOption> entry : optionsSelected.entrySet())
                            newPrice -= entry.getValue().getPrice();
                        optionsSelected.clear();
                    }
                    optionsSelected.put(position, new CartDishExtraOption(options.get(position), position));
                    newPrice += options.get(position).getPrice();
                    groakCallback.onSuccess(newPrice);
                }
                refresh();
            }
        });
    }

    @Override
    public int getItemCount() {
        return options.size();
    }

    /**
     * This function is called to generate the extra item from whatever is selected
     *
     * @return
     */
    public CartDishExtra getExtraItem() {
        if (extra.isMultipleSelections()) {
            if (optionsSelected.size() > extra.getMaxOptionsSelect()) {
                Catalog.toast(context, "Up to " + extra.getMaxOptionsSelect() + "option(s) can be selected for " + extra.getTitle());
                return null;
            }
            if (optionsSelected.size() < extra.getMinOptionsSelect()) {
                Catalog.toast(context, "Atleast " + extra.getMinOptionsSelect() + "option(s) required for " + extra.getTitle());
                return null;
            }
        } else {
            if (optionsSelected.size() != 1) {
                Catalog.toast(context, "Please select an option for " + extra.getTitle());
                return null;
            }
        }
        CartDishExtra cartExtra = new CartDishExtra(extra.getTitle());
        cartExtra.getOptions().addAll(optionsSelected.values());
        return cartExtra;
    }
}
