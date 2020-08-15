package com.groak.groak.activity.receipt;

import android.text.TextUtils;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.recyclerview.widget.RecyclerView;

import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.catalog.groakUIClasses.LocalBadgeView;
import com.groak.groak.catalog.TimeCatalog;
import com.groak.groak.restaurantobject.order.OrderDish;

public class ReceiptDishCell extends RecyclerView.ViewHolder {
    private ConstraintLayout layout;

    private TextView dishQuantity;
    private TextView dishName;
    private TextView dishPrice;
    private TextView created;
    private LocalBadgeView localBadgeView;

    private int titleDimensions = 20;
    private int infoDimensions = 15;

    public ReceiptDishCell(ConstraintLayout layout) {
        super(layout);

        this.layout = layout;

        setupViews();
        setupInitialLayout();
    }

    public void setDish(OrderDish dish) {
        dishQuantity.setText(Long.toString(dish.getQuantity()));
        dishName.setText(dish.getName());
        dishPrice.setText(Catalog.priceInString(dish.getPrice()));
        if (dish.isLocal()) localBadgeView.setVisibility(View.VISIBLE);
        else localBadgeView.setVisibility(View.GONE);
        created.setText(TimeCatalog.getTimeFromTimestamp(dish.getCreated()));
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
        dishName.setGravity(Gravity.LEFT);

        dishPrice = new TextView(layout.getContext());
        dishPrice.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        dishPrice.setId(View.generateViewId());
        dishPrice.setTextSize(titleDimensions);
        dishPrice.setTypeface(FontCatalog.fontLevels(layout.getContext(), 1));
        dishPrice.setTextColor(ColorsCatalog.blackColor);
        dishPrice.setGravity(Gravity.RIGHT);

        localBadgeView = new LocalBadgeView(layout.getContext(), true);
        localBadgeView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        localBadgeView.setId(View.generateViewId());

        created = new TextView(layout.getContext());
        created.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        created.setId(View.generateViewId());
        created.setTextSize(infoDimensions);
        created.setTypeface(FontCatalog.fontLevels(layout.getContext(), 1));
        created.setTextColor(ColorsCatalog.blackColor);
        created.setGravity(Gravity.RIGHT);
        created.setGravity(Gravity.CENTER_VERTICAL);

        layout.addView(dishQuantity);
        layout.addView(dishName);
        layout.addView(dishPrice);
        layout.addView(localBadgeView);
        layout.addView(created);
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

        set.connect(localBadgeView.getId(), ConstraintSet.TOP, dishName.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(localBadgeView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(localBadgeView.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.constrainHeight(localBadgeView.getId(), ConstraintSet.WRAP_CONTENT);
        set.constrainWidth(localBadgeView.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(created.getId(), ConstraintSet.TOP, dishName.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(created.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(created.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.constrainHeight(created.getId(), ConstraintSet.WRAP_CONTENT);
        set.constrainWidth(created.getId(), ConstraintSet.WRAP_CONTENT);

        set.applyTo(layout);
    }
}
