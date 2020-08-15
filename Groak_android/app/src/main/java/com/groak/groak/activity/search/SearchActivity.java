package com.groak.groak.activity.search;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.core.widget.NestedScrollView;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.groak.groak.activity.menu.MenuRecyclerViewAdapter;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.catalog.groakUIClasses.RecyclerViewHeader;
import com.groak.groak.localstorage.LocalRestaurant;
import com.groak.groak.restaurantobject.MenuCategory;
import com.groak.groak.restaurantobject.dish.Dish;

import java.util.ArrayList;

public class SearchActivity extends Activity {
    private ConstraintLayout layout;

    private SearchHeader menuHeader;
    private NestedScrollView scrollView;
    private ConstraintLayout scrollViewLayout;

    private ArrayList<RecyclerView> menuViews = new ArrayList<>();
    private ArrayList<RecyclerViewHeader> menuViewHeaders = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setupViews();

        setupInitialLayout();
    }

    private void setupViews() {
        layout = new ConstraintLayout(this);
        layout.setId(View.generateViewId());
        layout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        layout.setBackgroundColor(ColorsCatalog.headerGrayShade);

        menuHeader = new SearchHeader(this, new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
                String str = (String)object;

                scrollViewLayout.removeAllViews();
                menuViews.clear();
                menuViewHeaders.clear();

                if (str.length() != 0) {
                    for (MenuCategory category: LocalRestaurant.categories) {
                        ArrayList<Dish> dishes = new ArrayList<>();
                        for (Dish dish: category.getDishes()) {
                            if (findDishFromSearch(dish.getName(), str))
                                dishes.add(dish);
                        }
                        if (dishes.size() > 0) {
                            Dish[] dishesArray = new Dish[dishes.size()];
                            for (int i = 0; i < dishesArray.length; i++) dishesArray[i] = dishes.get(i);
                            setupRecyclerViewHeader(category);
                            setupRecyclerViewViews(dishesArray, str);
                        }
                    }

                    setupInitialLayout();
                }
            }
            @Override
            public void onFailure(Exception e) {
            }
        });
        menuHeader.setId(View.generateViewId());
        menuHeader.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        scrollView = new NestedScrollView(this);
        scrollView.setId(View.generateViewId());
        scrollView.setLayoutParams(new RelativeLayout.LayoutParams(0,0));
        scrollView.setNestedScrollingEnabled(false);
        scrollView.setBackgroundColor(ColorsCatalog.headerGrayShade);

        scrollViewLayout = new ConstraintLayout(this);
        scrollViewLayout.setId(View.generateViewId());
        scrollViewLayout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        scrollViewLayout.setBackgroundColor(ColorsCatalog.headerGrayShade);

        layout.addView(menuHeader);
        layout.addView(scrollView);
        scrollView.addView(scrollViewLayout);
        setContentView(layout);
    }

    private void setupRecyclerViewHeader(MenuCategory menuCategory) {
        RecyclerViewHeader menuViewHeader = new RecyclerViewHeader(this, menuCategory.getName(), "");

        menuViewHeader.setId(View.generateViewId());

        menuViewHeader.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        menuViewHeaders.add(menuViewHeader);

        scrollViewLayout.addView(menuViewHeader);
    }

    private void setupRecyclerViewViews(Dish[] dishes, String searchTerm) {
        RecyclerView menuView = new RecyclerView(this);

        menuView.setId(View.generateViewId());

        menuView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        menuView.setLayoutManager(new LinearLayoutManager(this));

        menuView.setAdapter(new MenuRecyclerViewAdapter(this, dishes, searchTerm));
        menuView.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.VERTICAL));
        menuView.setNestedScrollingEnabled(false);
        menuView.setBackgroundColor(ColorsCatalog.whiteColor);

        menuViews.add(menuView);

        scrollViewLayout.addView(menuView);
    }

    private void setupInitialLayout() {
        ConstraintSet set1 = new ConstraintSet();
        set1.clone(scrollViewLayout);

        for (int i = 0; i < menuViewHeaders.size(); i++) {
            RecyclerViewHeader menuViewHeader = menuViewHeaders.get(i);
            RecyclerView menuView = menuViews.get(i);

            if (i == 0)
                set1.connect(menuViewHeader.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
            else
                set1.connect(menuViewHeader.getId(), ConstraintSet.TOP, menuViews.get(i - 1).getId(), ConstraintSet.BOTTOM, 2* DimensionsCatalog.getDistanceBetweenElements(this));

            set1.connect(menuViewHeader.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
            set1.connect(menuViewHeader.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
            set1.constrainHeight(menuViewHeader.getId(), ConstraintSet.WRAP_CONTENT);

            set1.connect(menuView.getId(), ConstraintSet.TOP, menuViewHeader.getId(), ConstraintSet.BOTTOM);
            set1.connect(menuView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
            set1.connect(menuView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
            set1.constrainHeight(menuView.getId(), ConstraintSet.WRAP_CONTENT);
        }

        set1.applyTo(scrollViewLayout);

        ConstraintSet set = new ConstraintSet();
        set.clone(layout);

        set.connect(menuHeader.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set.connect(menuHeader.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(menuHeader.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.constrainHeight(menuHeader.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(scrollView.getId(), ConstraintSet.TOP, menuHeader.getId(), ConstraintSet.BOTTOM);
        set.connect(scrollView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(scrollView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(scrollView.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM);

        set.applyTo(layout);
    }

    private Context getContext() {
        return this;
    }

    private boolean findDishFromSearch(String dish, String search) {
        String[] dishWords = dish.toLowerCase().split(" ");
        for (String dishWord: dishWords) {
            if (dishWord.startsWith(search.toLowerCase())) return true;
        }
        return false;
    }

    @Override
    public void onUserInteraction() {
        if (getCurrentFocus() != null) {
            InputMethodManager inputMethodManager =(InputMethodManager)getSystemService(Activity.INPUT_METHOD_SERVICE);
            inputMethodManager.hideSoftInputFromWindow(getCurrentFocus().getWindowToken(), 0);
        }
    }
}
