package com.groak.groak.activity.cart;

import android.text.TextUtils;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.restaurantobject.dish.Dish;
import com.groak.groak.restaurantobject.dish.cart.CartDish;
import com.groak.groak.restaurantobject.dish.cart.CartDishExtra;

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
        dishQuantity.setTypeface(FontCatalog.fontLevels(layout.getContext(), 3));
        dishQuantity.setTextColor(ColorsCatalog.blackColor);
        dishQuantity.setGravity(Gravity.LEFT);

        dishName = new TextView(layout.getContext());
        dishName.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        dishName.setId(View.generateViewId());
        dishName.setTextSize(titleDimensions);
        dishName.setTypeface(FontCatalog.fontLevels(layout.getContext(), 1));
        dishName.setTextColor(ColorsCatalog.blackColor);
        dishName.setMaxLines(1);
        dishName.setEllipsize(TextUtils.TruncateAt.END);
        dishName.setGravity(Gravity.LEFT);

        dishPrice = new TextView(layout.getContext());
        dishPrice.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
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

        set.connect(dishQuantity.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, DimensionsCatalog.distanceBetweenElements);
        set.connect(dishQuantity.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.distanceBetweenElements);
        set.constrainPercentWidth(dishQuantity.getId(), 20);
        set.constrainHeight(dishQuantity.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(dishName.getId(), ConstraintSet.LEFT, dishQuantity.getId(), ConstraintSet.RIGHT, DimensionsCatalog.distanceBetweenElements);
        set.constrainPercentWidth(dishName.getId(), 60);
        set.centerVertically(dishName.getId(), dishQuantity.getId());
        set.constrainHeight(dishName.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(dishPrice.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.distanceBetweenElements);
        set.constrainPercentWidth(dishPrice.getId(), 25);
        set.centerVertically(dishPrice.getId(), dishQuantity.getId());
        set.constrainHeight(dishPrice.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(dishDetails.getId(), ConstraintSet.TOP, dishQuantity.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.distanceBetweenElements);
        set.connect(dishDetails.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.distanceBetweenElements);
        set.connect(dishDetails.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.distanceBetweenElements);
        set.connect(dishDetails.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, 2*DimensionsCatalog.distanceBetweenElements);
        set.constrainHeight(dishDetails.getId(), ConstraintSet.WRAP_CONTENT);

        set.applyTo(layout);
    }
}
