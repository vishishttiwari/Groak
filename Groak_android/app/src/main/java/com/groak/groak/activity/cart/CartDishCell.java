/**
 * This class is used to represent each cell in the CartView
 */
package com.groak.groak.activity.cart;

import android.view.Gravity;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.recyclerview.widget.RecyclerView;

import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.restaurantobject.cart.CartDish;

public class CartDishCell extends RecyclerView.ViewHolder {
    private ConstraintLayout layout;

    private TextView dishQuantity;
    private TextView dishName;
    private TextView dishPrice;
    private TextView dishDetails;

    private int titleDimensions = 20;
    private int otherDimensions = 20;
    private int infoDimensions = 15;

    public CartDishCell(ConstraintLayout layout) {
        super(layout);

        this.layout = layout;

        setupViews();
        setupInitialLayout();
    }

    public void setDish(CartDish dish) {
        dishQuantity.setText(Integer.toString(dish.getQuantity()));
        dishName.setText(dish.getName());
        dishPrice.setText(Catalog.priceInString(dish.getPrice()));
        dishDetails.setText(Catalog.showExtras(dish.getExtras(), true));
    }

    private void setupViews() {
        dishQuantity = new TextView(layout.getContext());
        dishQuantity.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        dishQuantity.setId(View.generateViewId());
        dishQuantity.setTextSize(titleDimensions);
        dishQuantity.setTypeface(FontCatalog.fontLevels(layout.getContext(), 2));
        dishQuantity.setTextColor(ColorsCatalog.blackColor);
        dishQuantity.setGravity(Gravity.LEFT);

        dishName = new TextView(layout.getContext());
        dishName.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        dishName.setId(View.generateViewId());
        dishName.setTextSize(titleDimensions);
        dishName.setTypeface(FontCatalog.fontLevels(layout.getContext(), 1));
        dishName.setTextColor(ColorsCatalog.blackColor);
        dishName.setGravity(Gravity.LEFT);

        dishPrice = new TextView(layout.getContext());
        dishPrice.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        dishPrice.setId(View.generateViewId());
        dishPrice.setTextSize(titleDimensions);
        dishPrice.setTypeface(FontCatalog.fontLevels(layout.getContext(), 1));
        dishPrice.setTextColor(ColorsCatalog.blackColor);
        dishPrice.setGravity(Gravity.RIGHT);

        dishDetails = new TextView(layout.getContext());
        dishDetails.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        dishDetails.setId(View.generateViewId());
        dishDetails.setTextSize(infoDimensions);
        dishDetails.setTypeface(FontCatalog.fontLevels(layout.getContext(), 1));
        dishDetails.setTextColor(ColorsCatalog.blackColor);
        dishDetails.setGravity(Gravity.LEFT);

        layout.addView(dishQuantity);
        layout.addView(dishName);
        layout.addView(dishPrice);
        layout.addView(dishDetails);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(layout);

        set.connect(dishName.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(dishName.getId(), ConstraintSet.LEFT, dishQuantity.getId(), ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.constrainWidth(dishName.getId(), 3*DimensionsCatalog.screenWidth/5);
        set.constrainHeight(dishName.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(dishQuantity.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(dishQuantity.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(dishQuantity.getId(), ConstraintSet.RIGHT, dishName.getId(), ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.constrainWidth(dishQuantity.getId(), 80);
        set.constrainHeight(dishQuantity.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(dishPrice.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(dishPrice.getId(), ConstraintSet.LEFT, dishName.getId(), ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(dishPrice.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.constrainHeight(dishPrice.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(dishDetails.getId(), ConstraintSet.TOP, dishName.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(dishDetails.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(dishDetails.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(dishDetails.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, 2*DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.constrainHeight(dishDetails.getId(), ConstraintSet.WRAP_CONTENT);

        set.applyTo(layout);
    }
}
