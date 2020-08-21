/**
 * This class is used for the search header
 */
package com.groak.groak.activity.search;

import android.app.Activity;
import android.content.Context;
import android.text.Editable;
import android.text.InputType;
import android.text.TextWatcher;
import android.view.Gravity;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;

import com.groak.groak.R;
import com.groak.groak.catalog.ColorsCatalog;
import com.groak.groak.catalog.DimensionsCatalog;
import com.groak.groak.catalog.GroakCallback;

public class SearchHeader extends ConstraintLayout {

    private EditText header;
    private ImageView back;
    private GroakCallback groakCallback;

    protected int headerHeight;
    protected int iconHeight;

    public SearchHeader(Context context, GroakCallback groakCallback) {
        super(context);

        headerHeight = DimensionsCatalog.getHeaderHeight(context);
        iconHeight = DimensionsCatalog.getHeaderIconHeight(context);

        this.groakCallback = groakCallback;

        setupViews();
        setupInitialLayout();
    }

    private void setupViews() {
        setBackgroundColor(ColorsCatalog.headerGrayShade);

        header = new EditText(getContext());
        header.setId(View.generateViewId());
        header.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        header.setMaxLines(1);
        header.setGravity(Gravity.LEFT);
        header.setGravity(Gravity.CENTER_VERTICAL);
        header.setTextSize(DimensionsCatalog.headerTextSize - 5);
        header.setImeOptions(EditorInfo.IME_ACTION_DONE);
        header.setRawInputType(InputType.TYPE_CLASS_TEXT);
        header.setHint("Search");
        header.setBackgroundResource(android.R.color.transparent);
        header.requestFocus();
        header.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void afterTextChanged(Editable editable) {
                groakCallback.onSuccess(editable.toString());
            }
        });

        back = new ImageView(getContext());
        back.setId(View.generateViewId());
        back.setImageResource(R.drawable.back);
        back.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        back.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                ((Activity)getContext()).finish();
            }
        });

        setElevation(DimensionsCatalog.elevation);

        addView(header);
        addView(back);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(this);

        set.connect(header.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(header.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(header.getId(), ConstraintSet.LEFT, back.getId(), ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.connect(header.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainHeight(header.getId(), headerHeight);

        set.centerVertically(back.getId(), header.getId());
        set.connect(back.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT, DimensionsCatalog.getDistanceBetweenElements(getContext()));
        set.constrainWidth(back.getId(), iconHeight);
        set.constrainHeight(back.getId(), iconHeight);

        set.applyTo(this);
    }
}