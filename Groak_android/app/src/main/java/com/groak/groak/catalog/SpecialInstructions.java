package com.groak.groak.catalog;

import android.content.Context;
import android.text.InputType;
import android.view.Gravity;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.LinearLayout;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;

public class SpecialInstructions extends ConstraintLayout {

    private RecyclerViewHeader specialInstructionsHeader;
    private EditText specialInstructions;

    public SpecialInstructions(Context context) {
        super(context);

        setupViews();
        setupInitialLayout();
    }

    public RecyclerViewHeader getSpecialInstructionsHeader() {
        return specialInstructionsHeader;
    }

    public EditText getSpecialInstructions() {
        return specialInstructions;
    }

    private void setupViews() {
        specialInstructionsHeader = new RecyclerViewHeader(getContext(), "Special Instructions", "");
        specialInstructionsHeader.setId(View.generateViewId());
        specialInstructionsHeader.setLayoutParams(new LinearLayout.LayoutParams(0, 0));

        specialInstructions = new EditText(getContext());
        specialInstructions.setId(View.generateViewId());
        specialInstructions.setLayoutParams(new LinearLayout.LayoutParams(0, 0));
        specialInstructions.setBackgroundColor(ColorsCatalog.whiteColor);
        specialInstructions.setPadding(DimensionsCatalog.distanceBetweenElements, 0, DimensionsCatalog.distanceBetweenElements, DimensionsCatalog.distanceBetweenElements);
        specialInstructions.setLines(5);
        specialInstructions.setGravity(Gravity.TOP);
        specialInstructions.setTextSize(18);
        specialInstructions.setImeOptions(EditorInfo.IME_ACTION_DONE);
        specialInstructions.setRawInputType(InputType.TYPE_CLASS_TEXT);
        specialInstructions.setHint("Leave a note for the kitchen...");

        addView(specialInstructionsHeader);
        addView(specialInstructions);
    }

    private void setupInitialLayout() {
        ConstraintSet set1 = new ConstraintSet();
        set1.clone(this);

        set1.connect(specialInstructionsHeader.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set1.connect(specialInstructionsHeader.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(specialInstructionsHeader.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(specialInstructionsHeader.getId(), ConstraintSet.WRAP_CONTENT);

        set1.connect(specialInstructions.getId(), ConstraintSet.TOP, specialInstructionsHeader.getId(), ConstraintSet.BOTTOM);
        set1.connect(specialInstructions.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set1.connect(specialInstructions.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set1.constrainHeight(specialInstructions.getId(), ConstraintSet.WRAP_CONTENT);

        set1.applyTo(this);
    }
}
