package com.groak.groak.activity.restaurant;

import android.content.Context;
import android.view.Gravity;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.restaurantobject.restaurant.Restaurant;

import static android.view.View.GONE;
import static android.view.View.VISIBLE;

public class RestaurantCell extends RecyclerView.ViewHolder {
    private ConstraintLayout layout;

    private ImageView restaurantLogo;
    private TextView restaurantNameSmall;
    private TextView restaurantNameBig;

    private Context context;

    public RestaurantCell(Context context, ConstraintLayout layout) {
        super(layout);

        this.layout = layout;

        this.context = context;

        setupViews();
        setupInitialLayout();
    }

    public void setRestaurant(Restaurant restaurant) {
        if (restaurant != null) {
            if (restaurant.getLogo() != null && restaurant.getLogo().length() != 0) {
                restaurantNameBig.setVisibility(GONE);
                restaurantNameSmall.setVisibility(VISIBLE);
                restaurantLogo.setVisibility(VISIBLE);
                restaurantNameSmall.setText(restaurant.getName());
                Glide.with(context).load(restaurant.getLogo()).override(320, 240).into(restaurantLogo);
            } else {
                restaurantNameBig.setVisibility(VISIBLE);
                restaurantNameSmall.setVisibility(GONE);
                restaurantLogo.setVisibility(GONE);
                restaurantNameBig.setText(restaurant.getName());
            }
        }
    }

    private void setupViews() {
        restaurantLogo = new ImageView(layout.getContext());
        restaurantLogo.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        restaurantLogo.setId(View.generateViewId());
        restaurantLogo.setScaleType(ImageView.ScaleType.FIT_XY);
        restaurantLogo.setBackgroundColor(ColorsCatalog.whiteColor);
        restaurantLogo.setVisibility(GONE);

        restaurantNameBig = new TextView(layout.getContext());
        restaurantNameBig.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        restaurantNameBig.setId(View.generateViewId());
        restaurantNameBig.setTextSize(DimensionsCatalog.headerTextSize);
        restaurantNameBig.setTypeface(FontCatalog.fontLevels(layout.getContext(), 1));
        restaurantNameBig.setTextColor(ColorsCatalog.blackColor);
        restaurantNameBig.setGravity(Gravity.CENTER);
        restaurantNameBig.setVisibility(GONE);

        restaurantNameSmall = new TextView(layout.getContext());
        restaurantNameSmall.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        restaurantNameSmall.setId(View.generateViewId());
        restaurantNameSmall.setTextSize(DimensionsCatalog.headerTextSize - 5);
        restaurantNameSmall.setTypeface(FontCatalog.fontLevels(layout.getContext(), 1));
        restaurantNameSmall.setTextColor(ColorsCatalog.blackColor);
        restaurantNameSmall.setGravity(Gravity.CENTER);
        restaurantNameSmall.setVisibility(GONE);

        layout.addView(restaurantLogo);
        layout.addView(restaurantNameBig);
        layout.addView(restaurantNameSmall);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(layout);

        set.connect(restaurantLogo.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, 2*DimensionsCatalog.distanceBetweenElements);
        set.connect(restaurantLogo.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(restaurantLogo.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(restaurantLogo.getId(), ConstraintSet.BOTTOM, restaurantNameSmall.getId(), ConstraintSet.TOP, DimensionsCatalog.distanceBetweenElements);
        set.constrainHeight(restaurantLogo.getId(), DimensionsCatalog.imageHeights);

        set.connect(restaurantNameBig.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, 2*DimensionsCatalog.distanceBetweenElements);
        set.connect(restaurantNameBig.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(restaurantNameBig.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(restaurantNameBig.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, 2*DimensionsCatalog.distanceBetweenElements);
        set.constrainHeight(restaurantNameBig.getId(), DimensionsCatalog.imageHeights);

        set.connect(restaurantNameSmall.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(restaurantNameSmall.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(restaurantNameSmall.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, 2*DimensionsCatalog.distanceBetweenElements);
        set.constrainHeight(restaurantNameSmall.getId(), ConstraintSet.WRAP_CONTENT);

        set.applyTo(layout);
    }
}

