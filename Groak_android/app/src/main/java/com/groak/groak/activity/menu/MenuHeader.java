package com.groak.groak.activity.menu;

import android.content.Context;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;

import androidx.constraintlayout.widget.ConstraintSet;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.LinearSnapHelper;
import androidx.recyclerview.widget.RecyclerView;
import androidx.recyclerview.widget.SnapHelper;

import com.groak.groak.R;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.catalog.groakUIClasses.groakheader.GroakFragmentHeader;

public class MenuHeader extends GroakFragmentHeader {

    private ImageView search;
    private RecyclerView categoriesView;

    public boolean disableScrolling = false;

    public MenuHeader(Context context, String header, GroakCallback callback) {
        super(context, header, callback);

        setupViews();

        setupInitialLayout();
    }

    private void setupViews() {
        categoriesView = new RecyclerView(getContext());
        categoriesView.setId(View.generateViewId());
        categoriesView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        categoriesView.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.HORIZONTAL, false));
        SnapHelper helper = new LinearSnapHelper();
        helper.attachToRecyclerView(categoriesView);
        categoriesView.setAdapter(new CategoriesRecyclerViewAdapter(getContext(), new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
                disableScrolling = true;
                Integer position = (Integer) object;
                groakCallback.onSuccess(position.toString());
                categoriesView.smoothScrollToPosition(position);
            }
            @Override
            public void onFailure(Exception e) {
            }
        }));

        search = new ImageView(getContext());
        search.setId(View.generateViewId());
        search.setImageResource(R.drawable.search);
        search.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        search.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                groakCallback.onSuccess("search");
            }
        });

        addView(search);
        addView(categoriesView);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();

        set.connect(header.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, DimensionsCatalog.distanceBetweenElements);
        set.connect(header.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 2*DimensionsCatalog.distanceBetweenElements + leaveHeight);
        set.connect(header.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 2*DimensionsCatalog.distanceBetweenElements + leaveHeight);
        set.constrainHeight(header.getId(), headerHeight);

        set.centerVertically(back.getId(), header.getId());
        set.connect(back.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.distanceBetweenElements);
        set.constrainWidth(back.getId(), leaveHeight);
        set.constrainHeight(back.getId(), leaveHeight);

        set.centerVertically(search.getId(), header.getId());
        set.connect(search.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.distanceBetweenElements);
        set.constrainWidth(search.getId(), iconHeight);
        set.constrainHeight(search.getId(), iconHeight);

        set.connect(categoriesView.getId(), ConstraintSet.TOP, header.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.distanceBetweenElements);
        set.connect(categoriesView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(categoriesView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(categoriesView.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, DimensionsCatalog.distanceBetweenElements);
        set.constrainHeight(categoriesView.getId(), ConstraintSet.WRAP_CONTENT);

        set.applyTo(this);
    }

    public void refresh() {
        ((CategoriesRecyclerViewAdapter) categoriesView.getAdapter()).refresh();
    }

    public void scrollTo(int position) {
        if (!disableScrolling) {
            categoriesView.smoothScrollToPosition(position);
            ((CategoriesRecyclerViewAdapter) categoriesView.getAdapter()).refresh(position);
        }
    }
}
