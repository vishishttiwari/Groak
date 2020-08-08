package com.groak.groak.activity.order;

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
import com.groak.groak.catalog.LocalBadgeView;
import com.groak.groak.catalog.TimeCatalog;
import com.groak.groak.restaurantobject.order.OrderDish;

public class OrderDishCell extends RecyclerView.ViewHolder {
    private ConstraintLayout layout;

    private TextView dishQuantity;
    private TextView dishName;
    private TextView dishPrice;
    private TextView dishDetails;
    private TextView created;
    private LocalBadgeView localBadgeView;

    private int titleDimensions = 20;
    private int infoDimensions = 15;

    public OrderDishCell(ConstraintLayout layout) {
        super(layout);

        this.layout = layout;

        setupViews();
        setupInitialLayout();
    }

    public void setDish(OrderDish dish) {
        dishQuantity.setText(Long.toString(dish.getQuantity()));
        dishName.setText(dish.getName());
        dishPrice.setText(Catalog.priceInString(dish.getPrice()));
        dishDetails.setText(Catalog.showExtras(dish.getExtras(), true, true));
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
        layout.addView(dishDetails);
        layout.addView(localBadgeView);
        layout.addView(created);
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
        set.constrainHeight(dishDetails.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(localBadgeView.getId(), ConstraintSet.TOP, dishDetails.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.distanceBetweenElements);
        set.connect(localBadgeView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.distanceBetweenElements);
        set.connect(localBadgeView.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, DimensionsCatalog.distanceBetweenElements);
        set.constrainHeight(localBadgeView.getId(), 100);
        set.constrainWidth(localBadgeView.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(created.getId(), ConstraintSet.TOP, dishDetails.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.distanceBetweenElements);
        set.connect(created.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.distanceBetweenElements);
        set.connect(created.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, DimensionsCatalog.distanceBetweenElements);
        set.constrainWidth(created.getId(), ConstraintSet.WRAP_CONTENT);

        set.applyTo(layout);
    }
}
