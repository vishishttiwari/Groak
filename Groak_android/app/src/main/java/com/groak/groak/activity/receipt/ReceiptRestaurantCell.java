/**
 * The class represents the restaurant cell in the receipt recycler view
 */
package com.groak.groak.activity.receipt;

import android.content.Context;
import android.view.Gravity;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;

import com.bumptech.glide.Glide;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.catalog.TimeCatalog;
import com.groak.groak.localstorage.LocalRestaurant;

public class ReceiptRestaurantCell extends ConstraintLayout {

    private ImageView restaurantLogo;
    private TextView restaurantName;
    private TextView address;
    private TextView time;

    public ReceiptRestaurantCell(Context context) {
        super(context);

        setupViews();

        setupInitialLayout();
    }

    private void setupViews() {
        setBackgroundColor(ColorsCatalog.whiteColor);

        restaurantLogo = new ImageView(getContext());
        restaurantLogo.setLayoutParams(new LinearLayout.LayoutParams(DimensionsCatalog.screenWidth, 300));
        restaurantLogo.setId(View.generateViewId());
        restaurantLogo.setScaleType(ImageView.ScaleType.FIT_CENTER);
        Glide.with(getContext()).load(LocalRestaurant.restaurant.getLogo()).override(DimensionsCatalog.screenWidth, 300).into(restaurantLogo);

        restaurantName = new TextView(getContext());
        restaurantName.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        restaurantName.setId(View.generateViewId());
        restaurantName.setTextSize(18);
        restaurantName.setTypeface(FontCatalog.fontLevels(getContext(), 2));
        restaurantName.setTextColor(ColorsCatalog.blackColor);
        restaurantName.setText(LocalRestaurant.restaurant.getName());
        restaurantName.setGravity(Gravity.CENTER);
        if (LocalRestaurant.restaurant.getLogo().length() == 0) {
            restaurantLogo.setVisibility(View.GONE);
            restaurantName.setVisibility(View.VISIBLE);
        } else {
            restaurantLogo.setVisibility(View.VISIBLE);
            restaurantName.setVisibility(View.GONE);
        }

        address = new TextView(getContext());
        address.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        address.setId(View.generateViewId());
        address.setTextSize(18);
        address.setTypeface(FontCatalog.fontLevels(getContext(), 2));
        address.setTextColor(ColorsCatalog.blackColor);
        address.setText((String)LocalRestaurant.restaurant.getAddress().get("formattedAddress"));
        address.setGravity(Gravity.CENTER);

        time = new TextView(getContext());
        time.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        time.setId(View.generateViewId());
        time.setTextSize(18);
        time.setTypeface(FontCatalog.fontLevels(getContext(), 2));
        time.setTextColor(ColorsCatalog.blackColor);
        time.setText(TimeCatalog.getCurrentDate());
        time.setGravity(Gravity.CENTER);

        addView(restaurantLogo);
        addView(restaurantName);
        addView(address);
        addView(time);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(this);

        set.connect(restaurantLogo.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, 2* DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(restaurantLogo.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(restaurantLogo.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(getContext()));

        set.connect(restaurantName.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, 2* DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(restaurantName.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(restaurantName.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainHeight(restaurantName.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(address.getId(), ConstraintSet.TOP, (restaurantName.getVisibility() == View.VISIBLE ? restaurantName.getId() : restaurantLogo.getId()), ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(address.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(address.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainHeight(address.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(time.getId(), ConstraintSet.TOP, address.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(time.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(time.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(time.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, 2* DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainHeight(time.getId(), ConstraintSet.WRAP_CONTENT);

        set.applyTo(this);
    }
}
