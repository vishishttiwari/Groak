/**
 * This is used to show the loading window of pizza
 */
package com.groak.groak.catalog.groakUIClasses;

import android.content.Context;
import android.os.Handler;
import android.view.Gravity;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;

import com.groak.groak.R;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;

public class LoadingView extends ConstraintLayout {
    private TextView loadingText;
    private ImageView loading;
    final Handler handler = new Handler();
    private int imageNumber = 1;

    public LoadingView(Context context, String title) {
        super(context);

        setupViews(title);
        setupInitialLayout();
    }

    private void setupViews(String title) {
        loadingText = new TextView(getContext());
        loadingText.setId(View.generateViewId());
        loadingText.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        loadingText.setTextSize(DimensionsCatalog.headerTextSize);
        loadingText.setTypeface(FontCatalog.fontLevels(getContext(), 1));
        loadingText.setTextColor(ColorsCatalog.blackColor);
        loadingText.setGravity(Gravity.CENTER);
        loadingText.setText(title);

        loading = new ImageView(getContext());
        loading.setId(View.generateViewId());
        loading.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        loading.setBackgroundColor(ColorsCatalog.whiteColor);
        loading.setImageResource(R.drawable.loading15);

        handler.postDelayed(
                new Runnable() {
                    @Override
                    public void run() {
                        switch (imageNumber) {
                            case 1:
                                loading.setImageResource(R.drawable.loading1);
                                break;
                            case 2:
                                loading.setImageResource(R.drawable.loading2);
                                break;
                            case 3:
                                loading.setImageResource(R.drawable.loading3);
                                break;
                            case 4:
                                loading.setImageResource(R.drawable.loading4);
                                break;
                            case 5:
                                loading.setImageResource(R.drawable.loading5);
                                break;
                            case 6:
                                loading.setImageResource(R.drawable.loading6);
                                break;
                            case 7:
                                loading.setImageResource(R.drawable.loading7);
                                break;
                            case 8:
                                loading.setImageResource(R.drawable.loading8);
                                break;
                            case 9:
                                loading.setImageResource(R.drawable.loading9);
                                break;
                            case 10:
                                loading.setImageResource(R.drawable.loading10);
                                break;
                            case 11:
                                loading.setImageResource(R.drawable.loading11);
                                break;
                            case 12:
                                loading.setImageResource(R.drawable.loading12);
                                break;
                            case 13:
                                loading.setImageResource(R.drawable.loading13);
                                break;
                            case 14:
                                loading.setImageResource(R.drawable.loading14);
                                break;
                            case 15:
                                loading.setImageResource(R.drawable.loading15);
                                break;
                        }
                        loading.postDelayed(this, 100);
                        imageNumber++;
                        if (imageNumber > 15) imageNumber = 1;
                    }
                },
                100);

        addView(loading);
        addView(loadingText);
    }

    private void setupInitialLayout() {
        ConstraintSet set1 = new ConstraintSet();
        set1.clone(this);

        set1.connect(loadingText.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set1.connect(loadingText.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set1.connect(loadingText.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set1.constrainHeight(loadingText.getId(), ConstraintSet.WRAP_CONTENT);

        set1.connect(loading.getId(), ConstraintSet.TOP, loadingText.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set1.connect(loading.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set1.connect(loading.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set1.connect(loading.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set1.constrainHeight(loading.getId(), DimensionsCatalog.getValueInDP(100, getContext()));
        set1.constrainWidth(loading.getId(), DimensionsCatalog.getValueInDP(100, getContext()));

        set1.applyTo(this);
    }
}
