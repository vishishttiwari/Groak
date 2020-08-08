package com.groak.groak.catalog;

import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;

public class LocalBadgeView extends ConstraintLayout {

    private int textSize = 12;

    private TextView text;

    public LocalBadgeView(Context context, boolean isOrder) {
        super(context);

        setupViews();

        if (isOrder)
            text.setText("YOUR  ORDER");
        else
            text.setText("YOUR  INSTRUCTION");

        setupInitialLayout();
    }

    private void setupViews() {
        text = new Button(getContext());
        text.setId(View.generateViewId());
        text.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        text.setTextSize(textSize);
        text.setTypeface(FontCatalog.fontLevels(getContext(), 1));
        text.setTextColor(ColorsCatalog.greenColor);
        text.setMaxLines(1);
        text.setBackgroundColor(Color.TRANSPARENT);
        text.setEllipsize(TextUtils.TruncateAt.END);

        GradientDrawable gd = new GradientDrawable();
        gd.setCornerRadius(10);
        gd.setStroke(5, ColorsCatalog.greenColor);
        setBackground(gd);

        addView(text);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(this);

        set.connect(text.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set.connect(text.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.distanceBetweenElements);
        set.connect(text.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.distanceBetweenElements);
        set.connect(text.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM);
        set.constrainHeight(text.getId(), ConstraintSet.WRAP_CONTENT);
        set.constrainWidth(text.getId(), ConstraintSet.WRAP_CONTENT);

        set.applyTo(this);
    }
}