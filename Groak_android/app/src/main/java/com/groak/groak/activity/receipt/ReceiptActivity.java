package com.groak.groak.activity.receipt;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.core.widget.NestedScrollView;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.groak.groak.R;
import com.groak.groak.activity.request.RequestActivity;
import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.catalog.groakUIClasses.RequestButton;
import com.groak.groak.catalog.groakUIClasses.groakfooter.GroakFooter;
import com.groak.groak.localstorage.LocalRestaurant;
import com.groak.groak.location.GooglePlayServicesLocationListener;

public class ReceiptActivity extends Activity {
    private ConstraintLayout layout;

    private ReceiptHeader receiptHeader;
    private NestedScrollView scrollView;
    private ConstraintLayout scrollViewLayout;
    private GroakFooter receiptFooter;

    private ReceiptRestaurantCell receiptRestaurantCell;
    private ReceiptTotalCell receiptTotalCell;
    private RecyclerView reciptView;

    private RequestButton requestButton;

    boolean tableOrder = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setupViews();

        setupInitialLayout();

        requestButton.registerBroadcast();

        refresh(tableOrder);
    }

    @Override
    protected void onResume() {
        super.onResume();

        GooglePlayServicesLocationListener.checkLocationPermissions(getContext());
    }

    public void refresh(boolean tableOrder) {
        ((ReceiptRecyclerViewHeader) reciptView.getAdapter()).refresh(tableOrder);
        receiptTotalCell.setTotalValue(LocalRestaurant.calculateOrderTotalPrice(tableOrder));
        if (LocalRestaurant.order == null || LocalRestaurant.order.getDishes().size() == 0) {
            reciptView.setVisibility(View.GONE);
        } else {
            reciptView.setVisibility(View.VISIBLE);
        }
    }

    private void setupViews() {
        layout = new ConstraintLayout(this);
        layout.setId(View.generateViewId());
        layout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        layout.setBackgroundColor(ColorsCatalog.headerGrayShade);

        receiptHeader = new ReceiptHeader(this, "Receipt", new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
                String str = (String)object;
                if (str.equals("back"))
                    requestButton.unRegisterBroadcast();
                else if (((String)object).equals("Table Order")) {
                    tableOrder = true;
                    refresh(tableOrder);
                } else if (((String)object).equals("Your Order")) {
                    tableOrder = false;
                    refresh(tableOrder);
                }
            }

            @Override
            public void onFailure(Exception e) {
            }
        });
        receiptHeader.setId(View.generateViewId());
        receiptHeader.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        final Context contextFinal = this;
        receiptFooter = new GroakFooter(this, "Save Receipt", new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
                MediaStore.Images.Media.insertImage(getContentResolver(), viewToBitmap(scrollView), "Receipt at " + LocalRestaurant.restaurant.getName() , "Receipt");  // Saves the image.
                Catalog.toast(contextFinal, "Receipt saved in the camera roll");
            }
            @Override
            public void onFailure(Exception e) {
            }
        });
        receiptFooter.setId(View.generateViewId());
        receiptFooter.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        scrollView = new NestedScrollView(this);
        scrollView.setId(View.generateViewId());
        scrollView.setLayoutParams(new RelativeLayout.LayoutParams(0, 0));
        scrollView.setNestedScrollingEnabled(false);
        scrollView.setBackgroundColor(ColorsCatalog.headerGrayShade);

        scrollViewLayout = new ConstraintLayout(this);
        scrollViewLayout.setId(View.generateViewId());
        scrollViewLayout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        scrollViewLayout.setBackgroundColor(ColorsCatalog.headerGrayShade);

        receiptRestaurantCell = new ReceiptRestaurantCell(this);
        receiptRestaurantCell.setId(View.generateViewId());
        receiptRestaurantCell.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        receiptRestaurantCell.setBackgroundColor(ColorsCatalog.whiteColor);

        receiptTotalCell = new ReceiptTotalCell(this);
        receiptTotalCell.setId(View.generateViewId());
        receiptTotalCell.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        receiptTotalCell.setBackgroundColor(ColorsCatalog.whiteColor);

        reciptView = new RecyclerView(this);
        reciptView.setId(View.generateViewId());
        reciptView.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        reciptView.setLayoutManager(new LinearLayoutManager(this));
        reciptView.setAdapter(new ReceiptRecyclerViewHeader(this));
        reciptView.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.VERTICAL));
        reciptView.setNestedScrollingEnabled(false);
        reciptView.setBackgroundColor(ColorsCatalog.whiteColor);
        reciptView.setVisibility(View.GONE);

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

        scrollViewLayout.addView(receiptRestaurantCell);
        scrollViewLayout.addView(receiptTotalCell);
        scrollViewLayout.addView(reciptView);
        layout.addView(receiptHeader);
        layout.addView(scrollView);
        layout.addView(receiptFooter);
        layout.addView(requestButton);
        scrollView.addView(scrollViewLayout);
        setContentView(layout);
    }

    private void setupInitialLayout() {
        ConstraintSet set1 = new ConstraintSet();
        set1.clone(scrollViewLayout);

        set1.connect(receiptRestaurantCell.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set1.connect(receiptRestaurantCell.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(receiptRestaurantCell.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(receiptRestaurantCell.getId(), ConstraintSet.WRAP_CONTENT);

        set1.connect(receiptTotalCell.getId(), ConstraintSet.TOP, receiptRestaurantCell.getId(), ConstraintSet.BOTTOM, 5);
        set1.connect(receiptTotalCell.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(receiptTotalCell.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(receiptTotalCell.getId(), ConstraintSet.WRAP_CONTENT);

        set1.connect(reciptView.getId(), ConstraintSet.TOP, receiptTotalCell.getId(), ConstraintSet.BOTTOM, 5);
        set1.connect(reciptView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(reciptView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.connect(reciptView.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM);
        set1.constrainHeight(reciptView.getId(), ConstraintSet.WRAP_CONTENT);

        set1.applyTo(scrollViewLayout);

        ConstraintSet set = new ConstraintSet();
        set.clone(layout);

        set.connect(receiptHeader.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set.connect(receiptHeader.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(receiptHeader.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.constrainHeight(receiptHeader.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(scrollView.getId(), ConstraintSet.TOP, receiptHeader.getId(), ConstraintSet.BOTTOM);
        set.connect(scrollView.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(scrollView.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(scrollView.getId(), ConstraintSet.BOTTOM, receiptFooter.getId(), ConstraintSet.TOP);

        set.connect(receiptFooter.getId(), ConstraintSet.TOP, scrollView.getId(), ConstraintSet.BOTTOM);
        set.connect(receiptFooter.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(receiptFooter.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(receiptFooter.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM);
        set.constrainHeight(receiptFooter.getId(), ConstraintSet.WRAP_CONTENT);

        set.connect(requestButton.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, DimensionsCatalog.getRequestButtonMarginFromBottom(getContext()));
        set.connect(requestButton.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getRequestButtonMarginFromRight(getContext()));
        set.constrainHeight(requestButton.getId(), ConstraintSet.WRAP_CONTENT);
        set.constrainWidth(requestButton.getId(), ConstraintSet.WRAP_CONTENT);

        set.applyTo(layout);
    }

    private Context getContext() {
        return this;
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        overridePendingTransition(R.anim.slide_in_left, R.anim.slide_out_right);
    }

    public Bitmap viewToBitmap(View view) {
        Bitmap bitmap = Bitmap.createBitmap(view.getWidth(), ((NestedScrollView)view).getChildAt(0).getHeight(), Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        view.draw(canvas);
        return bitmap;
    }
}
