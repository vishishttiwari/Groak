package com.groak.groak.activity.cart;

import android.content.Context;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;

import androidx.constraintlayout.widget.ConstraintSet;

import com.groak.groak.R;
import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.catalog.groakheader.GroakFragmentHeader;
import com.groak.groak.localstorage.LocalRestaurant;
import com.groak.groak.restaurantobject.dish.cart.Cart;

public class CartHeader extends GroakFragmentHeader {

    private ImageView delete;

    public CartHeader(Context context, String header, GroakCallback callback) {
        super(context, header, callback);

        setupViews();

        setupInitialLayout();
    }

    private void setupViews() {
        setBackgroundColor(ColorsCatalog.headerGrayShade);

        delete = new ImageView(getContext());
        delete.setId(View.generateViewId());
        delete.setImageResource(R.drawable.delete);
        delete.setLayoutParams(new LinearLayout.LayoutParams(iconHeight, iconHeight));
        delete.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                if (LocalRestaurant.cart.getDishes().size() > 0 || LocalRestaurant.cart.getComment().length() > 0) {
                    LocalRestaurant.cart = new Cart();
                    Catalog.alert(getContext(), "Delete Cart", "Would you like to empty the cart?", new GroakCallback() {
                        @Override
                        public void onSuccess(Object object) {
                            groakCallback.onSuccess("delete");
                            Catalog.toast(getContext(), "Cart deleted");
                        }
                        @Override
                        public void onFailure(Exception e) {
                        }
                    });
                }
            }
        });

        addView(delete);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(this);

        set.centerVertically(delete.getId(), ConstraintSet.PARENT_ID);
        set.connect(delete.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.distanceBetweenElements);
        set.constrainWidth(delete.getId(), iconHeight);
        set.constrainHeight(delete.getId(), iconHeight);

        set.applyTo(this);
    }
}
