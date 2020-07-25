package com.groak.groak.catalog.groakheader;

import android.app.Activity;
import android.content.Context;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;

import androidx.constraintlayout.widget.ConstraintSet;

import com.groak.groak.R;
import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.GroakCallback;

public class GroakOtherHeader extends GroakHeader {

    protected ImageView back;
    protected GroakCallback groakCallback;

    public GroakOtherHeader(Context context, String header, GroakCallback callback) {
        super(context, header);

        this.groakCallback = callback;

        setupViews();
        setupInitialLayout();
    }

    private void setupViews() {
        back = new ImageView(getContext());
        back.setId(View.generateViewId());
        back.setImageResource(R.drawable.back);
        back.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        back.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                groakCallback.onSuccess("back");
                ((Activity)getContext()).finish();
                ((Activity)getContext()).overridePendingTransition(R.anim.slide_in_left, R.anim.slide_out_right);
            }
        });

        addView(back);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(this);

        set.centerVertically(back.getId(), header.getId());
        set.connect(back.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.distanceBetweenElements);
        set.constrainWidth(back.getId(), iconHeight);
        set.constrainHeight(back.getId(), iconHeight);

        set.applyTo(this);
    }
}
