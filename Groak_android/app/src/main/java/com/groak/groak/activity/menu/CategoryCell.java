/**
 * This class is used to represent each cell in categories recyclerview
 */
package com.groak.groak.activity.menu;

import android.graphics.Color;
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

public class CategoryCell extends RecyclerView.ViewHolder {
    private ConstraintLayout layout;

    private TextView category;

    private int categoryDimensions = 20;

    public CategoryCell(ConstraintLayout layout) {
        super(layout);

        this.layout = layout;

        setupViews();
        setupInitialLayout();
    }

    public void setCategory(String category) {
        this.category.setText(category);
    }

    public void isSelected(boolean selected) {
        if (selected) {
            category.setTextColor(ColorsCatalog.whiteColor);
            GradientDrawable shape = new GradientDrawable();
            shape.setShape(GradientDrawable.RECTANGLE);
            shape.setColor(ColorsCatalog.themeColor);
            shape.setCornerRadius(50);
            category.setBackground(shape);
        } else {
            category.setTextColor(ColorsCatalog.blackColor);
            category.setBackgroundColor(Color.TRANSPARENT);
        }
    }

    private void setupViews() {
        category = new TextView(layout.getContext());
        category.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        category.setId(View.generateViewId());
        category.setTextSize(categoryDimensions);
        category.setTypeface(FontCatalog.fontLevels(layout.getContext(), 1));
        category.setTextColor(ColorsCatalog.blackColor);
        category.setGravity(Gravity.CENTER);
        category.setPadding(50, 20, 50, 20);

        layout.addView(category);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(layout);

        set.connect(category.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set.connect(category.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(category.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(layout.getContext()));
        set.connect(category.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM);
        set.constrainHeight(category.getId(), ConstraintSet.WRAP_CONTENT);
        set.constrainWidth(category.getId(), 4*DimensionsCatalog.screenWidth/7);

        set.applyTo(layout);
    }
}
