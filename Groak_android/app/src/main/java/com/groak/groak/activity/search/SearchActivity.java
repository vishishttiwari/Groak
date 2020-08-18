package com.groak.groak.activity.search;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.core.widget.NestedScrollView;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.groak.groak.R;
import com.groak.groak.activity.menu.MenuRecyclerViewAdapter;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.FontCatalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.catalog.groakUIClasses.RecyclerViewHeader;
import com.groak.groak.localstorage.LocalRestaurant;
import com.groak.groak.location.GooglePlayServicesLocationListener;
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
    private ImageView searchIconView;
    private TextView searchTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setupViews();

        setupInitialLayout();
    }

    @Override
    protected void onResume() {
        super.onResume();

        GooglePlayServicesLocationListener.checkLocationPermissions(getContext());
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
                        for (Dish dish : category.getDishes()) {
                            if (findDishFromSearch(dish.getName(), str))
                                dishes.add(dish);
                        }
                        if (dishes.size() > 0) {
                            Dish[] dishesArray = new Dish[dishes.size()];
                            for (int i = 0; i < dishesArray.length; i++)
                                dishesArray[i] = dishes.get(i);
                            setupRecyclerViewHeader(category);
                            setupRecyclerViewViews(dishesArray, str);
                            scrollView.setVisibility(View.VISIBLE);
                            searchIconView.setVisibility(View.GONE);
                            searchTextView.setVisibility(View.GONE);
                        } else {
                            scrollView.setVisibility(View.GONE);
                            searchIconView.setVisibility(View.VISIBLE);
                            searchTextView.setVisibility(View.VISIBLE);
                            searchIconView.setImageResource(R.drawable.search_not_found);
                            searchTextView.setText("No dishes found");
                        }
                    }
                } else {
                    scrollView.setVisibility(View.GONE);
                    searchIconView.setVisibility(View.VISIBLE);
                    searchTextView.setVisibility(View.VISIBLE);
                    searchIconView.setImageResource(R.drawable.search1);
                    searchTextView.setText("Search dishes here!");
                }
                setupInitialLayout();
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
        scrollView.setVisibility(View.GONE);

        scrollViewLayout = new ConstraintLayout(this);
        scrollViewLayout.setId(View.generateViewId());
        scrollViewLayout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        scrollViewLayout.setBackgroundColor(ColorsCatalog.headerGrayShade);

        searchIconView = new ImageView(getContext());
        searchIconView.setId(View.generateViewId());
        searchIconView.setImageResource(R.drawable.search1);
        searchIconView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        searchTextView = new TextView(getContext());
        searchTextView.setId(View.generateViewId());
        searchTextView.setTextSize(DimensionsCatalog.headerTextSize);
        searchTextView.setTypeface(FontCatalog.fontLevels(getContext(), 1));
        searchTextView.setTextColor(ColorsCatalog.blackColor);
        searchTextView.setGravity(Gravity.CENTER);
        searchTextView.setText("Search dishes here!");
        searchTextView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        layout.addView(menuHeader);
        layout.addView(scrollView);
        layout.addView(searchIconView);
        layout.addView(searchTextView);
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

        set.connect(searchIconView.getId(), ConstraintSet.TOP, menuHeader.getId(), ConstraintSet.BOTTOM, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(searchIconView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(searchIconView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainHeight(searchIconView.getId(), DimensionsCatalog.screenHeight/4);

        set.connect(searchTextView.getId(), ConstraintSet.TOP, searchIconView.getId(), ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(searchTextView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(searchTextView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, 2*DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainHeight(searchTextView.getId(), ConstraintSet.WRAP_CONTENT);

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
    public boolean dispatchTouchEvent(MotionEvent ev) {
        View view = getCurrentFocus();
        if (view != null && (ev.getAction() == MotionEvent.ACTION_UP || ev.getAction() == MotionEvent.ACTION_MOVE) && view instanceof EditText && !view.getClass().getName().startsWith("android.webkit.")) {
            int scrcoords[] = new int[2];
            view.getLocationOnScreen(scrcoords);
            float x = ev.getRawX() + view.getLeft() - scrcoords[0];
            float y = ev.getRawY() + view.getTop() - scrcoords[1];
            if (x < view.getLeft() || x > view.getRight() || y < view.getTop() || y > view.getBottom())
                ((InputMethodManager)this.getSystemService(Context.INPUT_METHOD_SERVICE)).hideSoftInputFromWindow((this.getWindow().getDecorView().getApplicationWindowToken()), 0);
        }
        return super.dispatchTouchEvent(ev);
    }
}
