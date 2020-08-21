/**
 * This class is used got the small badge next to the icon tab to show how many dishes there are in the cart
 */
package com.groak.groak.catalog.groakUIClasses;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.drawable.GradientDrawable;
import android.view.Gravity;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;

import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.localstorage.LocalRestaurant;

public class CartBadgeView extends ConstraintLayout {

    private TextView badgeView;

    private int height;

    private BroadcastReceiver broadcastReceiver;

    public CartBadgeView(Context context) {
        super(context);

        height = DimensionsCatalog.getValueInDP(30, context);

        setupViews();
        setupInitialLayout();
        initBroadcast();
    }

    public void setText(int value) {
        if (value > 0) {
            badgeView.setVisibility(View.VISIBLE);
            badgeView.setText(String.valueOf(value));
        } else {
            badgeView.setVisibility(View.GONE);
        }
    }

    private void setupViews() {
        badgeView = new TextView(getContext());
        badgeView.setId(View.generateViewId());
        badgeView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        badgeView.setText(String.valueOf(LocalRestaurant.cart.getDishes().size()));
        badgeView.setTextColor(ColorsCatalog.whiteColor);
        badgeView.setBackgroundColor(ColorsCatalog.themeColor);
        badgeView.setGravity(Gravity.CENTER);
        GradientDrawable badgeViewShape = new GradientDrawable();
        badgeViewShape.setShape(GradientDrawable.RECTANGLE);
        badgeViewShape.setColor(ColorsCatalog.themeColor);
        badgeViewShape.setCornerRadius(height/2);
        badgeView.setBackground(badgeViewShape);
        badgeView.setVisibility(View.GONE);

        addView(badgeView);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(this);

        set.connect(badgeView.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, 10);
        set.connect(badgeView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.screenWidth/8 - 80);
        set.constrainWidth(badgeView.getId(), height);
        set.constrainHeight(badgeView.getId(), height);

        set.applyTo(this);
    }

    /**
     * This function is used for broadcasting of any dishes added to the cart. This changes the badge
     */
    private void initBroadcast() {
        broadcastReceiver = new BroadcastReceiver() {

            @Override
            public void onReceive(Context arg0, Intent intent) {
                String action = intent.getAction();
                if (action.equals("change_cart_badge"))
                    setText(LocalRestaurant.cart.getDishes().size());
            }
        };
    }

    public void registerBroadcast() {
        if (broadcastReceiver != null) {
            getContext().registerReceiver(broadcastReceiver, new IntentFilter("change_cart_badge"));
        }
    }

    public void unRegisterBroadcast() {
        if (broadcastReceiver != null) {
            getContext().unregisterReceiver(broadcastReceiver);
        }
    }
}
