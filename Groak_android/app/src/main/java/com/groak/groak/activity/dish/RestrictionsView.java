package com.groak.groak.activity.dish;

import android.content.Context;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;

import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.catalog.groakUIClasses.RestrictionsSymbol;

public class RestrictionsView extends ConstraintLayout {
    private int height = 80;
    private int textSize = 12;

    private RestrictionsSymbol symbol;
    private TextView textView;

    public RestrictionsView(Context context, String symbolText, int color, String text) {
        super(context);

        setupViews(symbolText, color, text);

        setupInitialLayout();
    }

    private void setupViews(String symbolText, int color, String text) {
        setBackgroundColor(ColorsCatalog.whiteColor);

        symbol = new RestrictionsSymbol(getContext(), symbolText, color);
        symbol.setId(View.generateViewId());
        symbol.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        textView = new TextView(getContext());
        textView.setId(View.generateViewId());
        textView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        textView.setTextColor(ColorsCatalog.blackColor);
        textView.setTypeface(FontCatalog.fontLevels(getContext(), 2));
        textView.setTextSize(18);
        textView.setBackgroundColor(ColorsCatalog.whiteColor);
        textView.setText(text);

        addView(symbol);
        addView(textView);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(this);

        set.connect(symbol.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set.connect(symbol.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.constrainHeight(symbol.getId(), height);
        set.constrainWidth(symbol.getId(), height);

        set.centerVertically(textView.getId(), symbol.getId());
        set.connect(textView.getId(), ConstraintSet.LEFT, symbol.getId(), ConstraintSet.RIGHT, DimensionsCatalog.distanceBetweenElements);
        set.connect(textView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.distanceBetweenElements);
        set.constrainHeight(textView.getId(), ConstraintSet.WRAP_CONTENT);

        set.applyTo(this);
    }
}