package com.groak.groak.activity.tabbar;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.LinearLayout;

import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.bottomnavigation.LabelVisibilityMode;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.groak.groak.R;
import com.groak.groak.activity.request.RequestActivity;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.groakUIClasses.RequestButton;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.fragment.app.FragmentPagerAdapter;
import androidx.viewpager.widget.ViewPager;

public class TabbarActivity extends AppCompatActivity {

    private ConstraintLayout layout;

    private NonSwipeableViewPager mainContent;
    private BottomNavigationView tabbar;

    private RequestButton requestButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getSupportActionBar().hide();

        setupViews();

        setupInitialLayout();
    }

    private void setupViews() {
        layout = new ConstraintLayout(this);
        layout.setId(View.generateViewId());
        layout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        layout.setBackgroundColor(ColorsCatalog.headerGrayShade);

        setContentView(layout);

        mainContent = new NonSwipeableViewPager(this);
        TabbarViewPagerAdapter adapter = new TabbarViewPagerAdapter(getSupportFragmentManager(), FragmentPagerAdapter.BEHAVIOR_RESUME_ONLY_CURRENT_FRAGMENT);
        mainContent.setAdapter(adapter);
        mainContent.setId(View.generateViewId());
        mainContent.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        tabbar = new BottomNavigationView(this);
        tabbar.setId(View.generateViewId());
        tabbar.setLayoutParams(new LinearLayout.LayoutParams(0,0));
        Menu menu = tabbar.getMenu();
        menu.add(0, 1, 0, "Menu").setIcon(R.drawable.menu);
        menu.add(0, 2, 0, "Cart").setIcon(R.drawable.cart);
        menu.add(0, 3, 0, "Table Order").setIcon(R.drawable.table);
        menu.add(0, 4, 0, "Covid").setIcon(R.drawable.covid);
        tabbar.setBackgroundColor(ColorsCatalog.headerGrayShade);
        tabbar.setLabelVisibilityMode(LabelVisibilityMode.LABEL_VISIBILITY_LABELED);
        tabbar.setOnNavigationItemSelectedListener(new BottomNavigationView.OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem menuItem) {
                switch (menuItem.getItemId()) {
                    case 1:
                        mainContent.setCurrentItem(0);
                        return true;
                    case 2:
                        mainContent.setCurrentItem(1);
                        return true;
                    case 3:
                        mainContent.setCurrentItem(2);
                        return true;
                    case 4:
                        mainContent.setCurrentItem(3);
                        return true;
                }
                return false;
            }
        });
        tabbar.setElevation(DimensionsCatalog.elevation);

        requestButton = new RequestButton(this);
        requestButton.setId(View.generateViewId());
        requestButton.setLayoutParams(new LinearLayout.LayoutParams(0,0));
        requestButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent =  new Intent(getContext(), RequestActivity.class);
                getContext().startActivity(intent);
            }
        });

        layout.addView(mainContent);
        layout.addView(tabbar);
        layout.addView(requestButton);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(layout);

        set.connect(mainContent.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, 0);
        set.connect(mainContent.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 0);
        set.connect(mainContent.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 0);
        set.connect(mainContent.getId(), ConstraintSet.BOTTOM, tabbar.getId(), ConstraintSet.TOP, 0);

        set.connect(tabbar.getId(), ConstraintSet.TOP, mainContent.getId(), ConstraintSet.BOTTOM, 0);
        set.connect(tabbar.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, 0);
        set.connect(tabbar.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 0);
        set.connect(tabbar.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 0);
        set.constrainHeight(tabbar.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(requestButton.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, 400);
        set.connect(requestButton.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 100);
        set.constrainHeight(requestButton.getId(), ConstraintSet.WRAP_CONTENT);
        set.constrainWidth(requestButton.getId(), ConstraintSet.WRAP_CONTENT);

        set.applyTo(layout);
    }

    private Context getContext() {
        return this;
    }

    @Override
    public void onUserInteraction() {
        if (getCurrentFocus() != null) {
            InputMethodManager inputMethodManager =(InputMethodManager)getSystemService(Activity.INPUT_METHOD_SERVICE);
            inputMethodManager.hideSoftInputFromWindow(getCurrentFocus().getWindowToken(), 0);
        }
    }
}