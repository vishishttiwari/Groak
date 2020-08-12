package com.groak.groak.activity.cart;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.core.widget.NestedScrollView;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.catalog.groakUIClasses.RecyclerViewHeader;
import com.groak.groak.catalog.groakUIClasses.SpecialInstructions;
import com.groak.groak.catalog.groakUIClasses.groakfooter.GroakFooterWithPrice;
import com.groak.groak.firebase.firestoreAPICalls.FirestoreAPICallsOrders;
import com.groak.groak.localstorage.LocalRestaurant;
import com.groak.groak.restaurantobject.cart.Cart;

public class CartFragment extends Fragment {

    private ConstraintLayout layout;

    private CartHeader cartHeader;
    private NestedScrollView scrollView;
    private ConstraintLayout scrollViewLayout;
    private GroakFooterWithPrice cartFooter;

    private RecyclerViewHeader cartViewHeader;
    private RecyclerView cartView;

    private SpecialInstructions specialInstructions;
    private RecyclerView specialInstructionsView;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        setupViews();

        setupInitialLayout();

        return layout;
    }

    @Override
    public void onResume() {
        super.onResume();
        refresh();
    }

    public void refresh() {
        ((CartRecyclerViewAdapter)cartView.getAdapter()).refresh();
        if (LocalRestaurant.cart != null && LocalRestaurant.cart.getDishes().size() == 0) {
            cartViewHeader.setVisibility(View.GONE);
            cartView.setVisibility(View.GONE);
            specialInstructions.setVisibility(View.GONE);
            cartFooter.setVisibility(View.GONE);
        } else {
            cartViewHeader.setVisibility(View.VISIBLE);
            cartView.setVisibility(View.VISIBLE);
            specialInstructions.setVisibility(View.VISIBLE);
            cartFooter.setVisibility(View.VISIBLE);
            cartFooter.changePrice(LocalRestaurant.calculateCartTotalPrice());
        }
    }

    private void setupViews() {
        layout = new ConstraintLayout(getContext());
        layout.setId(View.generateViewId());
        layout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        layout.setBackgroundColor(ColorsCatalog.headerGrayShade);

        cartHeader = new CartHeader(getContext(), "Your Cart", new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
                if (((String)object).equals("delete")) {
                    LocalRestaurant.cart = new Cart();
                    refresh();
                }
            }
            @Override
            public void onFailure(Exception e) {
            }
        });
        cartHeader.setId(View.generateViewId());
        cartHeader.setLayoutParams(new LinearLayout.LayoutParams(0,0));

        cartFooter = new GroakFooterWithPrice(getContext(), "Order", LocalRestaurant.calculateCartTotalPrice(), new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
                LocalRestaurant.cart.setComment(specialInstructions.getText());
                FirestoreAPICallsOrders.addOrdersFirestoreAPI(getContext(), new GroakCallback() {
                    @Override
                    public void onSuccess(Object object) {
                        LocalRestaurant.cart = new Cart();
                        refresh();
                        Catalog.toast(getContext(), "Order placed successfully");
                    }
                    @Override
                    public void onFailure(Exception e) {
                        Catalog.toast(getContext(), "Error placing order. Please try again");
                    }
                });
            }
            @Override
            public void onFailure(Exception e) {
            }
        });
        cartFooter.setId(View.generateViewId());
        cartFooter.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        cartFooter.setVisibility(View.GONE);

        scrollView = new NestedScrollView(getContext());
        scrollView.setId(View.generateViewId());
        scrollView.setLayoutParams(new RelativeLayout.LayoutParams(0, 0));
        scrollView.setNestedScrollingEnabled(false);
        scrollView.setBackgroundColor(ColorsCatalog.headerGrayShade);

        scrollViewLayout = new ConstraintLayout(getContext());
        scrollViewLayout.setId(View.generateViewId());
        scrollViewLayout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        scrollViewLayout.setBackgroundColor(ColorsCatalog.headerGrayShade);

        cartViewHeader = new RecyclerViewHeader(getContext(), "Cart", "");
        cartViewHeader.setId(View.generateViewId());
        cartViewHeader.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        cartViewHeader.setVisibility(View.GONE);

        cartView = new RecyclerView(getContext());
        cartView.setId(View.generateViewId());
        cartView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        cartView.setLayoutManager(new LinearLayoutManager(getContext()));
        cartView.setAdapter(new CartRecyclerViewAdapter(getContext()));
        cartView.addItemDecoration(new DividerItemDecoration(getContext(), DividerItemDecoration.VERTICAL));
        cartView.setNestedScrollingEnabled(false);
        cartView.setBackgroundColor(ColorsCatalog.whiteColor);
        cartView.setVisibility(View.GONE);

        specialInstructions = new SpecialInstructions(getContext());
        specialInstructions.setId(View.generateViewId());
        specialInstructions.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        specialInstructions.setVisibility(View.GONE);

        scrollViewLayout.addView(cartViewHeader);
        scrollViewLayout.addView(cartView);
        scrollViewLayout.addView(specialInstructions);
        layout.addView(cartHeader);
        layout.addView(scrollView);
        layout.addView(cartFooter);
        scrollView.addView(scrollViewLayout);
    }

    private void setupInitialLayout() {
        ConstraintSet set1 = new ConstraintSet();
        set1.clone(scrollViewLayout);

        set1.connect(cartViewHeader.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set1.connect(cartViewHeader.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(cartViewHeader.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(cartViewHeader.getId(), ConstraintSet.WRAP_CONTENT);

        set1.connect(cartView.getId(), ConstraintSet.TOP, cartViewHeader.getId(), ConstraintSet.BOTTOM);
        set1.connect(cartView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(cartView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(cartView.getId(), ConstraintSet.WRAP_CONTENT);

        set1.connect(specialInstructions.getId(), ConstraintSet.TOP, cartView.getId(), ConstraintSet.BOTTOM, 2* DimensionsCatalog.distanceBetweenElements);
        set1.connect(specialInstructions.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(specialInstructions.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(specialInstructions.getId(), ConstraintSet.WRAP_CONTENT);

        set1.applyTo(scrollViewLayout);

        ConstraintSet set = new ConstraintSet();
        set.clone(layout);

        set.connect(cartHeader.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set.connect(cartHeader.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(cartHeader.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.constrainHeight(cartHeader.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(scrollView.getId(), ConstraintSet.TOP, cartHeader.getId(), ConstraintSet.BOTTOM);
        set.connect(scrollView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(scrollView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(scrollView.getId(), ConstraintSet.BOTTOM, cartFooter.getId(), ConstraintSet.TOP);

        set.connect(cartFooter.getId(), ConstraintSet.TOP, scrollView.getId(), ConstraintSet.BOTTOM);
        set.connect(cartFooter.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(cartFooter.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(cartFooter.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM);
        set.constrainHeight(cartFooter.getId(), ConstraintSet.WRAP_CONTENT);

        set.applyTo(layout);
    }
}
