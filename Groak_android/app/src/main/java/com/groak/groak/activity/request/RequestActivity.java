package com.groak.groak.activity.request;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.LinearLayout;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.catalog.groakUIClasses.groakheader.GroakOtherHeader;
import com.groak.groak.firebase.firestoreAPICalls.FirestoreAPICallsRequests;
import com.groak.groak.localstorage.LocalRestaurant;
import com.groak.groak.restaurantobject.request.Request;
import com.groak.groak.restaurantobject.request.Requests;

public class RequestActivity extends Activity {
    private ConstraintLayout layout;

    private RequestHeader requestHeader;
    private RecyclerView requestView;
    private RequestFooter requestFooter;

    private boolean refreshedOnce = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        downloadRequests();

        setupViews();

        setupInitialLayout();
    }

    public void downloadRequests() {
        FirestoreAPICallsRequests.fetchRequestFirestoreAPI(new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
                LocalRestaurant.requests = (Requests)object;
                refresh();
            }

            @Override
            public void onFailure(Exception e) {
                Catalog.toast(getContext(), "Error getting requests from restaurant");
            }
        });
    }

    public void refresh() {
        ((RequestRecyclerViewAdapter) requestView.getAdapter()).refresh();
        if (LocalRestaurant.requests == null || LocalRestaurant.requests.getRequests() == null || LocalRestaurant.requests.getRequests().size() == 0) {
            requestView.setVisibility(View.GONE);
        } else {
            requestView.setVisibility(View.VISIBLE);
            if (!refreshedOnce) {
                requestView.scrollToPosition(LocalRestaurant.requests.getRequests().size() - 1);
                refreshedOnce = true;
            } else {
                requestView.smoothScrollToPosition(LocalRestaurant.requests.getRequests().size() - 1);
            }
        }
    }

    private void setupViews() {
        layout = new ConstraintLayout(this);
        layout.setId(View.generateViewId());
        layout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        layout.setBackgroundColor(ColorsCatalog.headerGrayShade);

        requestHeader = new RequestHeader(this, "", new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
            }
            @Override
            public void onFailure(Exception e) {
            }
        });
        requestHeader.setId(View.generateViewId());
        requestHeader.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        requestView = new RecyclerView(getContext());
        requestView.setId(View.generateViewId());
        requestView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        requestView.setLayoutManager(new LinearLayoutManager(getContext()));
        requestView.setAdapter(new RequestRecyclerViewAdapter(getContext()));
        requestView.setBackgroundColor(ColorsCatalog.whiteColor);
        requestView.setVisibility(View.GONE);

        requestFooter = new RequestFooter(this, new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
                String str = (String)object;
                Request request = new Request(str);
                FirestoreAPICallsRequests.addRequestFirestoreAPI(request, new GroakCallback() {
                    @Override
                    public void onSuccess(Object object) {
                        requestFooter.setText("");
                    }
                    @Override
                    public void onFailure(Exception e) {
                        Catalog.toast(getContext(), "Error sending request");
                    }
                });
            }
            @Override
            public void onFailure(Exception e) {
            }
        });
        requestFooter.setId(View.generateViewId());
        requestFooter.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        layout.addView(requestHeader);
        layout.addView(requestView);
        layout.addView(requestFooter);
        setContentView(layout);
    }


    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(layout);

        set.connect(requestHeader.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set.connect(requestHeader.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(requestHeader.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.constrainHeight(requestHeader.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(requestView.getId(), ConstraintSet.TOP, requestHeader.getId(), ConstraintSet.BOTTOM);
        set.connect(requestView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(requestView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(requestView.getId(), ConstraintSet.BOTTOM, requestFooter.getId(), ConstraintSet.TOP);

        set.connect(requestFooter.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(requestFooter.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(requestFooter.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM);
        set.constrainHeight(requestFooter.getId(), ConstraintSet.WRAP_CONTENT);

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
