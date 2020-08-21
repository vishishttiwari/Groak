/**
 * This class is used to present the instruction cell in the order view
 */
package com.groak.groak.activity.order;

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
import com.groak.groak.catalog.groakUIClasses.LocalBadgeView;
import com.groak.groak.catalog.TimeCatalog;
import com.groak.groak.restaurantobject.order.OrderComment;

public class InstructionDishCell extends RecyclerView.ViewHolder {
    private ConstraintLayout layout;

    private TextView comment;
    private TextView created;
    private LocalBadgeView localBadgeView;

    private int titleDimensions = 20;
    private int infoDimensions = 15;

    public InstructionDishCell(ConstraintLayout layout) {
        super(layout);

        this.layout = layout;

        setupViews();
        setupInitialLayout();
    }

    public void setComment(OrderComment comment) {
        this.comment.setText(comment.getComment());
        if (comment.isLocal()) localBadgeView.setVisibility(View.VISIBLE);
        else localBadgeView.setVisibility(View.GONE);
        created.setText(TimeCatalog.getTimeFromTimestamp(comment.getCreated()));
    }

    private void setupViews() {
        comment = new TextView(layout.getContext());
        comment.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        comment.setId(View.generateViewId());
        comment.setTextSize(titleDimensions);
        comment.setTypeface(FontCatalog.fontLevels(layout.getContext(), 1));
        comment.setTextColor(ColorsCatalog.blackColor);
        comment.setGravity(Gravity.LEFT);

        localBadgeView = new LocalBadgeView(layout.getContext(), false);
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

        layout.addView(comment);
        layout.addView(localBadgeView);
        layout.addView(created);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(layout);

        set.connect(comment.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(comment.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(created.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.constrainHeight(comment.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(localBadgeView.getId(), ConstraintSet.TOP, comment.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(localBadgeView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(localBadgeView.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.constrainHeight(localBadgeView.getId(), ConstraintSet.WRAP_CONTENT);
        set.constrainWidth(localBadgeView.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(created.getId(), ConstraintSet.TOP, comment.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(created.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(created.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.constrainHeight(created.getId(), ConstraintSet.WRAP_CONTENT);
        set.constrainWidth(created.getId(), ConstraintSet.WRAP_CONTENT);

        set.applyTo(layout);
    }
}