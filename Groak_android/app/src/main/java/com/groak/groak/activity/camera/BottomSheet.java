package com.groak.groak.activity.camera;

import android.app.Activity;
import android.content.Context;
import android.graphics.drawable.GradientDrawable;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;

import com.bumptech.glide.Glide;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.restaurantobject.restaurant.Restaurant;

public class BottomSheet extends ConstraintLayout {

    private TextView welcome;
    private TextView restaurantNameSmall;
    private ImageView restaurantLogo;
    private TextView restaurantNameBig;
    private Button differentRestaurant;

    public BottomSheet(Context context) {
        super(context);

        setupViews();

        setupInitialLayout();
    }

    public void updateRestaurant(Restaurant restaurant) {
        if (restaurant != null) {
            if (restaurant.getLogo() != null && restaurant.getLogo().length() != 0) {
                restaurantNameBig.setVisibility(GONE);
                restaurantNameSmall.setVisibility(VISIBLE);
                restaurantLogo.setVisibility(VISIBLE);
                restaurantNameSmall.setText(restaurant.getName());
                Glide.with(getContext()).load(restaurant.getLogo()).override(320, 240).into(restaurantLogo);
            } else {
                restaurantNameBig.setVisibility(VISIBLE);
                restaurantNameSmall.setVisibility(GONE);
                restaurantLogo.setVisibility(GONE);
                restaurantNameBig.setText(restaurant.getName());
            }
        }
    }

    private void setupViews() {
        welcome = new TextView(getContext());
        welcome.setId(View.generateViewId());
        welcome.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        welcome.setTextColor(ColorsCatalog.blackColor);
        welcome.setTypeface(FontCatalog.fontLevels(getContext(), 1));
        welcome.setTextSize(DimensionsCatalog.headerTextSize);
        welcome.setBackgroundColor(ColorsCatalog.headerGrayShade);
        welcome.setText("Welcome To");
        welcome.setGravity(Gravity.CENTER);
        welcome.setPadding(0, 20, 0, 20);

        restaurantNameSmall = new TextView(getContext());
        restaurantNameSmall.setId(View.generateViewId());
        restaurantNameSmall.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        restaurantNameSmall.setTextColor(ColorsCatalog.blackColor);
        restaurantNameSmall.setTypeface(FontCatalog.fontLevels(getContext(), 1));
        restaurantNameSmall.setTextSize(DimensionsCatalog.headerTextSize - 5);
        restaurantNameSmall.setBackgroundColor(ColorsCatalog.whiteColor);
        restaurantNameSmall.setGravity(Gravity.CENTER);
        restaurantNameSmall.setVisibility(GONE);

        restaurantLogo = new ImageView(getContext());
        restaurantLogo.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        restaurantLogo.setId(View.generateViewId());
        restaurantLogo.setScaleType(ImageView.ScaleType.FIT_XY);
        restaurantLogo.setBackgroundColor(ColorsCatalog.whiteColor);
        restaurantLogo.setVisibility(GONE);

        restaurantNameBig = new TextView(getContext());
        restaurantNameBig.setId(View.generateViewId());
        restaurantNameBig.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        restaurantNameBig.setTextColor(ColorsCatalog.blackColor);
        restaurantNameBig.setTypeface(FontCatalog.fontLevels(getContext(), 1));
        restaurantNameBig.setTextSize(DimensionsCatalog.headerTextSize + 10);
        restaurantNameBig.setBackgroundColor(ColorsCatalog.whiteColor);
        restaurantNameBig.setGravity(Gravity.CENTER);
        restaurantNameBig.setVisibility(GONE);

        differentRestaurant = new Button(getContext());
        differentRestaurant.setId(View.generateViewId());
        differentRestaurant.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        differentRestaurant.setTextSize(DimensionsCatalog.headerTextSize);
        differentRestaurant.setTypeface(FontCatalog.fontLevels(getContext(), 1));
        differentRestaurant.setTextColor(ColorsCatalog.whiteColor);
        differentRestaurant.setGravity(Gravity.CENTER);
        differentRestaurant.setMaxLines(1);
        differentRestaurant.setEllipsize(TextUtils.TruncateAt.END);
        differentRestaurant.setText("Different Restaurant?");
        GradientDrawable shape = new GradientDrawable();
        shape.setShape(GradientDrawable.RECTANGLE);
        shape.setColor(ColorsCatalog.themeColor);
        shape.setCornerRadius(15);
        differentRestaurant.setBackground(shape);
        differentRestaurant.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                ((Activity)getContext()).finish();
            }
        });

        addView(welcome);
        addView(restaurantNameSmall);
        addView(restaurantLogo);
        addView(restaurantNameBig);
        addView(differentRestaurant);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(this);

        set.connect(welcome.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set.connect(welcome.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(welcome.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.constrainHeight(welcome.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(restaurantNameSmall.getId(), ConstraintSet.TOP, welcome.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.distanceBetweenElements);
        set.connect(restaurantNameSmall.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(restaurantNameSmall.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.constrainHeight(restaurantNameSmall.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(restaurantNameBig.getId(), ConstraintSet.TOP, welcome.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.distanceBetweenElements);
        set.connect(restaurantNameBig.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(restaurantNameBig.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(restaurantNameBig.getId(), ConstraintSet.BOTTOM, differentRestaurant.getId(), ConstraintSet.TOP);

        set.connect(restaurantLogo.getId(), ConstraintSet.TOP, restaurantNameSmall.getId(), ConstraintSet.BOTTOM);
        set.connect(restaurantLogo.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(restaurantLogo.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(restaurantLogo.getId(), ConstraintSet.BOTTOM, differentRestaurant.getId(), ConstraintSet.TOP);

        set.connect(differentRestaurant.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 2*DimensionsCatalog.distanceBetweenElements);
        set.connect(differentRestaurant.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 2*DimensionsCatalog.distanceBetweenElements);
        set.connect(differentRestaurant.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, 2*DimensionsCatalog.distanceBetweenElements);
        set.constrainHeight(differentRestaurant.getId(), DimensionsCatalog.headerHeight);

        set.applyTo(this);
    }
}
