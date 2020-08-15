package com.groak.groak.catalog.groakUIClasses;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.ColorStateList;
import android.graphics.drawable.GradientDrawable;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;

import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.groak.groak.R;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.localstorage.LocalRestaurant;

public class RequestButton extends ConstraintLayout {

    private FloatingActionButton requestButton;
    private TextView badgeView;

    private BroadcastReceiver broadcastReceiver;

    private int height;

    public RequestButton(Context context) {
        super(context);

        height = DimensionsCatalog.getValueInDP(20, context);

        setupViews();
        setupInitialLayout();
        initBroadcast();
    }

    public void setText() {
        if (LocalRestaurant.requestNotifications) {
            badgeView.setVisibility(View.VISIBLE);
            badgeView.setText(" ");
        } else {
            badgeView.setVisibility(View.GONE);
            badgeView.setText("");
        }
    }

    private void setupViews() {
        requestButton = new FloatingActionButton(getContext());
        requestButton.setId(View.generateViewId());
        requestButton.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        requestButton.setImageResource(R.drawable.chat);
        requestButton.setBackgroundTintList(ColorStateList.valueOf(ColorsCatalog.headerGrayShade));
        requestButton.setElevation(DimensionsCatalog.elevation);
        requestButton.setSize(FloatingActionButton.SIZE_NORMAL);

        badgeView = new TextView(getContext());
        badgeView.setId(View.generateViewId());
        badgeView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        badgeView.setTextColor(ColorsCatalog.whiteColor);
        badgeView.setBackgroundColor(ColorsCatalog.themeColor);
        badgeView.setGravity(Gravity.CENTER);
        GradientDrawable badgeViewShape = new GradientDrawable();
        badgeViewShape.setShape(GradientDrawable.RECTANGLE);
        badgeViewShape.setColor(ColorsCatalog.themeColor);
        badgeViewShape.setCornerRadius(height/2);
        badgeView.setBackground(badgeViewShape);
        badgeView.setElevation(DimensionsCatalog.elevation + 30);
        if (LocalRestaurant.requestNotifications) {
            badgeView.setVisibility(View.VISIBLE);
            badgeView.setText(" ");
        } else {
            badgeView.setVisibility(View.GONE);
            badgeView.setText("");
        }

        addView(requestButton);
        addView(badgeView);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(this);

        set.connect(requestButton.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(requestButton.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(requestButton.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(requestButton.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainWidth(requestButton.getId(), ConstraintSet.WRAP_CONTENT);
        set.constrainHeight(requestButton.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(badgeView.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(badgeView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainWidth(badgeView.getId(), height);
        set.constrainHeight(badgeView.getId(), height);

        set.applyTo(this);
    }

    private void initBroadcast() {
        broadcastReceiver = new BroadcastReceiver() {

            @Override
            public void onReceive(Context arg0, Intent intent) {
                String action = intent.getAction();
                if (action.equals("change_request_badge"))
                    setText();
            }
        };
    }

    public void registerBroadcast() {
        if (broadcastReceiver != null) {
            getContext().registerReceiver(broadcastReceiver, new IntentFilter("change_request_badge"));
        }
    }

    public void unRegisterBroadcast() {
        if (broadcastReceiver != null) {
            getContext().unregisterReceiver(broadcastReceiver);
        }
    }
}