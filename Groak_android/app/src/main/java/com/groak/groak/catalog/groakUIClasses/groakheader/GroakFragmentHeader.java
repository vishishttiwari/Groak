/**
 * This class is used for headers for fragment where it has the leave button
 */
package com.groak.groak.catalog.groakUIClasses.groakheader;

import android.content.Context;
import android.view.Gravity;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintSet;

import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.localstorage.LocalRestaurant;

public class GroakFragmentHeader extends GroakHeader {

    protected TextView back;
    protected GroakCallback groakCallback;

    public GroakFragmentHeader(Context context, String header, GroakCallback callback) {
        super(context, header);

        this.groakCallback = callback;

        setupViews();
        setupInitialLayout();
    }

    private void setupViews() {
        back = new TextView(getContext());
        back.setId(generateViewId());
        back.setText("Leave");
        back.setTextSize(DimensionsCatalog.headerTextSize - 12);
        back.setGravity(Gravity.CENTER);
        back.setTypeface(FontCatalog.fontLevels(getContext(), 1));
        back.setTextColor(ColorsCatalog.themeColor);
        back.setMaxLines(1);
        back.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        back.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                LocalRestaurant.leaveRestaurant(getContext());
            }
        });

        addView(back);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(this);

        set.connect(header.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(header.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(header.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()) + leaveHeight);
        set.connect(header.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()) + leaveHeight);
        set.constrainHeight(header.getId(), headerHeight);

        set.centerVertically(back.getId(), header.getId());
        set.connect(back.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainWidth(back.getId(), leaveHeight);
        set.constrainHeight(back.getId(), leaveHeight);

        set.applyTo(this);
    }
}
