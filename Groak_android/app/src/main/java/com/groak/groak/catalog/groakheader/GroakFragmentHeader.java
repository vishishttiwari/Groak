package com.groak.groak.catalog.groakheader;

import android.content.Context;
import android.view.Gravity;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintSet;

import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.catalog.GroakCallback;

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
        back.setId(View.generateViewId());
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
                Catalog.alert(getContext(), "Leaving restaurant?", "Are you sure you would like to leave the restaurant?. Your cart will be lost.", new GroakCallback() {
                    @Override
                    public void onSuccess(Object object) {
                        groakCallback.onSuccess("back");
                    }
                    @Override
                    public void onFailure(Exception e) {
                    }
                });
            }
        });

        addView(back);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(this);

        set.centerVertically(header.getId(), ConstraintSet.PARENT_ID);
        set.connect(header.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 2*DimensionsCatalog.distanceBetweenElements + leaveHeight);
        set.connect(header.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 2*DimensionsCatalog.distanceBetweenElements + leaveHeight);
        set.constrainHeight(header.getId(), headerHeight);

        set.centerVertically(back.getId(), header.getId());
        set.connect(back.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.distanceBetweenElements);
        set.constrainWidth(back.getId(), leaveHeight);
        set.constrainHeight(back.getId(), leaveHeight);

        set.applyTo(this);
    }
}
