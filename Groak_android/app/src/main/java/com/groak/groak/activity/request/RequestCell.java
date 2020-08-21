/**
 * This class is used to represent each chat cell in request activity
 */
package com.groak.groak.activity.request;

import android.graphics.drawable.GradientDrawable;
import android.view.Gravity;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.recyclerview.widget.RecyclerView;

import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.catalog.TimeCatalog;
import com.groak.groak.restaurantobject.request.Request;

public class RequestCell  extends RecyclerView.ViewHolder {
    private ConstraintLayout layout;

    private ConstraintLayout backgroundByUser;
    private TextView requestByUser;
    private TextView timeByUser;

    private ConstraintLayout backgroundByRestaurant;
    private TextView requestByRestaurant;
    private TextView timeByRestaurant;

    private int requestDimensions = 15;
    private int timeDimensions = 12;

    public RequestCell(ConstraintLayout layout) {
        super(layout);

        this.layout = layout;

        setupViews();
        setupInitialLayout();
    }

    public void setRequestByUser(Request request) {
        this.requestByUser.setText(request.getRequest());
        this.requestByRestaurant.setText(request.getRequest());
        this.timeByUser.setText(TimeCatalog.getTimeFromTimestamp(request.getCreated()));
        this.timeByRestaurant.setText(TimeCatalog.getTimeFromTimestamp(request.getCreated()));
        if (request.isCreatedByUser()) {
            backgroundByUser.setVisibility(View.VISIBLE);
            backgroundByRestaurant.setVisibility(View.GONE);
        } else {
            backgroundByRestaurant.setVisibility(View.VISIBLE);
            backgroundByUser.setVisibility(View.GONE);
        }
    }

    private void setupViews() {
        layout.setBackgroundColor(ColorsCatalog.whiteColor);

        backgroundByUser = new ConstraintLayout(layout.getContext());
        backgroundByUser.setId(View.generateViewId());
        backgroundByUser.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        GradientDrawable shape = new GradientDrawable();
        shape.setShape(GradientDrawable.RECTANGLE);
        shape.setColor(ColorsCatalog.themeColor);
        shape.setCornerRadius(20);
        backgroundByUser.setBackground(shape);
        backgroundByUser.setVisibility(View.GONE);

        requestByUser = new TextView(layout.getContext());
        requestByUser.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        requestByUser.setId(View.generateViewId());
        requestByUser.setTextSize(requestDimensions);
        requestByUser.setTypeface(FontCatalog.fontLevels(layout.getContext(), 1));
        requestByUser.setTextColor(ColorsCatalog.whiteColor);
        requestByUser.setGravity(Gravity.LEFT);
        requestByUser.setSingleLine(false);
        requestByUser.setPadding(20, 20, 20, 0);

        timeByUser = new TextView(layout.getContext());
        timeByUser.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        timeByUser.setId(View.generateViewId());
        timeByUser.setTextSize(timeDimensions);
        timeByUser.setTypeface(FontCatalog.fontLevels(layout.getContext(), 1));
        timeByUser.setTextColor(ColorsCatalog.whiteColor);
        timeByUser.setGravity(Gravity.RIGHT);
        timeByUser.setSingleLine(false);
        timeByUser.setPadding(20, 20, 20, 20);

        backgroundByRestaurant = new ConstraintLayout(layout.getContext());
        backgroundByRestaurant.setId(View.generateViewId());
        backgroundByRestaurant.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        GradientDrawable shape1 = new GradientDrawable();
        shape1.setShape(GradientDrawable.RECTANGLE);
        shape1.setColor(ColorsCatalog.shadesOfGray[11]);
        shape1.setCornerRadius(20);
        backgroundByRestaurant.setBackground(shape1);
        backgroundByRestaurant.setVisibility(View.GONE);

        requestByRestaurant = new TextView(layout.getContext());
        requestByRestaurant.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        requestByRestaurant.setId(View.generateViewId());
        requestByRestaurant.setTextSize(requestDimensions);
        requestByRestaurant.setTypeface(FontCatalog.fontLevels(layout.getContext(), 1));
        requestByRestaurant.setTextColor(ColorsCatalog.whiteColor);
        requestByRestaurant.setGravity(Gravity.LEFT);
        requestByRestaurant.setSingleLine(false);
        requestByRestaurant.setPadding(20, 20, 20, 20);

        timeByRestaurant = new TextView(layout.getContext());
        timeByRestaurant.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        timeByRestaurant.setId(View.generateViewId());
        timeByRestaurant.setTextSize(timeDimensions);
        timeByRestaurant.setTypeface(FontCatalog.fontLevels(layout.getContext(), 1));
        timeByRestaurant.setTextColor(ColorsCatalog.whiteColor);
        timeByRestaurant.setGravity(Gravity.RIGHT);
        timeByRestaurant.setSingleLine(false);
        timeByRestaurant.setPadding(20, 20, 20, 20);

        backgroundByUser.addView(requestByUser);
        backgroundByUser.addView(timeByUser);
        backgroundByRestaurant.addView(requestByRestaurant);
        backgroundByRestaurant.addView(timeByRestaurant);
        layout.addView(backgroundByUser);
        layout.addView(backgroundByRestaurant);
    }

    private void setupInitialLayout() {
        ConstraintSet set1 = new ConstraintSet();
        set1.clone(backgroundByUser);

        set1.connect(requestByUser.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set1.connect(requestByUser.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(requestByUser.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(requestByUser.getId(), ConstraintSet.WRAP_CONTENT);
        set1.constrainWidth(requestByUser.getId(), ConstraintSet.MATCH_CONSTRAINT);

        set1.connect(timeByUser.getId(), ConstraintSet.TOP, requestByUser.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set1.connect(timeByUser.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(timeByUser.getId(), ConstraintSet.WRAP_CONTENT);
        set1.constrainWidth(timeByUser.getId(), ConstraintSet.WRAP_CONTENT);

        set1.applyTo(backgroundByUser);

        ConstraintSet set2 = new ConstraintSet();
        set2.clone(backgroundByRestaurant);

        set2.connect(requestByRestaurant.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set2.connect(requestByRestaurant.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set2.connect(requestByRestaurant.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set2.constrainHeight(requestByRestaurant.getId(), ConstraintSet.WRAP_CONTENT);
        set2.constrainWidth(requestByRestaurant.getId(), ConstraintSet.MATCH_CONSTRAINT);

        set2.connect(timeByRestaurant.getId(), ConstraintSet.TOP, requestByRestaurant.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set2.connect(timeByRestaurant.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set2.constrainHeight(timeByRestaurant.getId(), ConstraintSet.WRAP_CONTENT);
        set2.constrainWidth(timeByRestaurant.getId(), ConstraintSet.WRAP_CONTENT);

        set2.applyTo(backgroundByRestaurant);

        ConstraintSet set = new ConstraintSet();
        set.clone(layout);

        set.connect(backgroundByRestaurant.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(backgroundByRestaurant.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(backgroundByRestaurant.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.constrainHeight(backgroundByRestaurant.getId(), ConstraintSet.WRAP_CONTENT);
        set.constrainWidth(backgroundByRestaurant.getId(), 3*DimensionsCatalog.screenWidth/4);

        set.connect(backgroundByUser.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(backgroundByUser.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(backgroundByUser.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.constrainHeight(backgroundByUser.getId(), ConstraintSet.WRAP_CONTENT);
        set.constrainWidth(backgroundByUser.getId(), 3*DimensionsCatalog.screenWidth/4);

        set.applyTo(layout);
    }
}