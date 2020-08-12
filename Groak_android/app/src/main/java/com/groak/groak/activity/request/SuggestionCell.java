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

public class SuggestionCell extends RecyclerView.ViewHolder {
    private ConstraintLayout layout;

    private TextView suggestion;

    private int suggestionDimensions = 20;

    public SuggestionCell(ConstraintLayout layout) {
        super(layout);

        this.layout = layout;

        setupViews();
        setupInitialLayout();
    }

    public void setSuggestion(String suggestion) {
        this.suggestion.setText(suggestion);
    }

    private void setupViews() {
        suggestion = new TextView(layout.getContext());
        suggestion.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        suggestion.setId(View.generateViewId());
        suggestion.setTextSize(suggestionDimensions);
        suggestion.setTypeface(FontCatalog.fontLevels(layout.getContext(), 1));
        suggestion.setTextColor(ColorsCatalog.whiteColor);
        suggestion.setGravity(Gravity.CENTER);
        suggestion.setPadding(50, 20, 50, 20);
        GradientDrawable shape = new GradientDrawable();
        shape.setShape(GradientDrawable.RECTANGLE);
        shape.setColor(ColorsCatalog.themeColor);
        shape.setCornerRadius(50);
        suggestion.setBackground(shape);

        layout.addView(suggestion);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(layout);

        set.connect(suggestion.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set.connect(suggestion.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.distanceBetweenElements);
        set.connect(suggestion.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.distanceBetweenElements);
        set.connect(suggestion.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM);
        set.constrainHeight(suggestion.getId(), ConstraintSet.WRAP_CONTENT);
        set.constrainWidth(suggestion.getId(), ConstraintSet.WRAP_CONTENT);

        set.applyTo(layout);
    }
}