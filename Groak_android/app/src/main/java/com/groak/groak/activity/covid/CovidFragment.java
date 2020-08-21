/**
 * This fragment is used for representing the Covid screen in the tab bar screens
 */
package com.groak.groak.activity.covid;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.core.widget.NestedScrollView;
import androidx.fragment.app.Fragment;

import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.catalog.groakUIClasses.RecyclerViewHeader;
import com.groak.groak.catalog.groakUIClasses.groakheader.GroakFragmentHeader;
import com.groak.groak.localstorage.LocalRestaurant;

public class CovidFragment extends Fragment {
    private ConstraintLayout layout;

    private GroakFragmentHeader covidHeader;
    private NestedScrollView scrollView;
    private ConstraintLayout scrollViewLayout;

    private RecyclerViewHeader guidelineHeaderView;
    private TextView guidelineView;

    private RecyclerViewHeader messageHeaderView;
    private TextView messageView;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        setupViews();

        setupInitialLayout();

        return layout;
    }

    @Override
    public void onResume() {
        super.onResume();
    }

    private void setupViews() {
        layout = new ConstraintLayout(getContext());
        layout.setId(View.generateViewId());
        layout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        layout.setBackgroundColor(ColorsCatalog.headerGrayShade);

        covidHeader = new GroakFragmentHeader(getContext(), "COVID-19", new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
            }
            @Override
            public void onFailure(Exception e) {
            }
        });
        covidHeader.setId(View.generateViewId());
        covidHeader.setLayoutParams(new LinearLayout.LayoutParams(0,0));

        scrollView = new NestedScrollView(getContext());
        scrollView.setId(View.generateViewId());
        scrollView.setLayoutParams(new RelativeLayout.LayoutParams(0, 0));
        scrollView.setNestedScrollingEnabled(false);
        scrollView.setBackgroundColor(ColorsCatalog.headerGrayShade);

        scrollViewLayout = new ConstraintLayout(getContext());
        scrollViewLayout.setId(View.generateViewId());
        scrollViewLayout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        scrollViewLayout.setBackgroundColor(ColorsCatalog.headerGrayShade);

        guidelineHeaderView = new RecyclerViewHeader(getContext(), "Covid Guidelines", "");
        guidelineHeaderView.setId(View.generateViewId());
        guidelineHeaderView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        guidelineView = new TextView(getContext());
        guidelineView.setId(View.generateViewId());
        guidelineView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        guidelineView.setTextColor(ColorsCatalog.blackColor);
        guidelineView.setTypeface(FontCatalog.fontLevels(getContext(), 1));
        guidelineView.setTextSize(18);
        guidelineView.setBackgroundColor(ColorsCatalog.whiteColor);
        guidelineView.setPadding(DimensionsCatalog.getDistanceBetweenElements(getContext()), 0, DimensionsCatalog.getDistanceBetweenElements(getContext()), DimensionsCatalog.getDistanceBetweenElements(getContext()));
        if (LocalRestaurant.restaurant == null || LocalRestaurant.restaurant.getCovidGuidelines() == null) {
            guidelineHeaderView.setVisibility(View.GONE);
            guidelineView.setVisibility(View.GONE);
        } else {
            guidelineHeaderView.setVisibility(View.VISIBLE);
            guidelineView.setVisibility(View.VISIBLE);
            guidelineView.setText(LocalRestaurant.restaurant.getCovidGuidelines());
        }

        messageHeaderView = new RecyclerViewHeader(getContext(), "Restaurant Message", "");
        messageHeaderView.setId(View.generateViewId());
        messageHeaderView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        messageView = new TextView(getContext());
        messageView.setId(View.generateViewId());
        messageView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        messageView.setTextColor(ColorsCatalog.blackColor);
        messageView.setTypeface(FontCatalog.fontLevels(getContext(), 1));
        messageView.setTextSize(18);
        messageView.setBackgroundColor(ColorsCatalog.whiteColor);
        messageView.setPadding(DimensionsCatalog.getDistanceBetweenElements(getContext()), 0, DimensionsCatalog.getDistanceBetweenElements(getContext()), DimensionsCatalog.getDistanceBetweenElements(getContext()));
        if (LocalRestaurant.restaurant == null || LocalRestaurant.restaurant.getCovidMessage() == null) {
            messageHeaderView.setVisibility(View.GONE);
            messageView.setVisibility(View.GONE);
        } else {
            messageHeaderView.setVisibility(View.VISIBLE);
            messageView.setVisibility(View.VISIBLE);
            messageView.setText(LocalRestaurant.restaurant.getCovidMessage());
        }

        scrollViewLayout.addView(guidelineHeaderView);
        scrollViewLayout.addView(guidelineView);
        scrollViewLayout.addView(messageHeaderView);
        scrollViewLayout.addView(messageView);
        layout.addView(covidHeader);
        layout.addView(scrollView);
        scrollView.addView(scrollViewLayout);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(scrollViewLayout);

        set.connect(guidelineHeaderView.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set.connect(guidelineHeaderView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(guidelineHeaderView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.constrainHeight(guidelineHeaderView.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(guidelineView.getId(), ConstraintSet.TOP, guidelineHeaderView.getId(), ConstraintSet.BOTTOM);
        set.connect(guidelineView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(guidelineView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.constrainHeight(guidelineView.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(messageView.getId(), ConstraintSet.TOP, guidelineView.getId(), ConstraintSet.BOTTOM, 2* DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(messageHeaderView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(messageHeaderView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.constrainHeight(messageHeaderView.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(messageView.getId(), ConstraintSet.TOP, messageHeaderView.getId(), ConstraintSet.BOTTOM);
        set.connect(messageView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(messageView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(messageView.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM);
        set.constrainHeight(messageView.getId(), ConstraintSet.WRAP_CONTENT);

        set.applyTo(scrollViewLayout);

        ConstraintSet set1 = new ConstraintSet();
        set1.clone(layout);

        set1.connect(covidHeader.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set1.connect(covidHeader.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(covidHeader.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(covidHeader.getId(), ConstraintSet.WRAP_CONTENT);

        set1.connect(scrollView.getId(), ConstraintSet.TOP, covidHeader.getId(), ConstraintSet.BOTTOM);
        set1.connect(scrollView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(scrollView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.connect(scrollView.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM);

        set1.applyTo(layout);
    }
}
