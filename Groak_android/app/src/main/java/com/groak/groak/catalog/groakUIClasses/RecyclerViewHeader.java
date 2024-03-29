/**
 * This class is used as a header for every recycler view. It includes a header and sub header.
 */
package com.groak.groak.catalog.groakUIClasses;

import android.content.Context;
import android.view.Gravity;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;

import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;

public class RecyclerViewHeader extends ConstraintLayout {

    private TextView header;
    private TextView subHeader;

    public RecyclerViewHeader(Context context, String header, String subHeader) {
        super(context);

        setupViews();

        if (header == null || header.length() == 0)
            this.header.setVisibility(View.GONE);
        else {
            this.header.setVisibility(View.VISIBLE);
            this.header.setText(header);
        }

        if (subHeader == null || subHeader.length() == 0)
            this.subHeader.setVisibility(View.GONE);
        else {
            this.subHeader.setVisibility(View.VISIBLE);
            this.subHeader.setText(subHeader);
        }

        setupInitialLayout();
    }

    private void setupViews() {
        setBackgroundColor(ColorsCatalog.whiteColor);

        header = new TextView(getContext());
        header.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));
        header.setId(View.generateViewId());
        header.setTextSize(25);
        header.setTypeface(FontCatalog.fontLevels(getContext(), 3));
        header.setTextColor(ColorsCatalog.blackColor);
        header.setGravity(Gravity.LEFT);

        subHeader = new TextView(getContext());
        subHeader.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));
        subHeader.setId(View.generateViewId());
        subHeader.setTextSize(15);
        subHeader.setTypeface(FontCatalog.fontLevels(getContext(), 1));
        subHeader.setTextColor(ColorsCatalog.grayColor);
        subHeader.setGravity(Gravity.LEFT);

        addView(header);
        addView(subHeader);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(this);

        set.connect(header.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(header.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(header.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainHeight(header.getId(), DimensionsCatalog.getValueInDP(50, getContext()));

        set.connect(subHeader.getId(), ConstraintSet.TOP, header.getId(), ConstraintSet.BOTTOM);
        set.connect(subHeader.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(subHeader.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainHeight(subHeader.getId(), DimensionsCatalog.getValueInDP(30, getContext()));

        set.applyTo(this);
    }
}
