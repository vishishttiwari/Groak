/**
 * The font are used all across the project
 */
package com.groak.groak.catalog;

import android.content.Context;
import android.graphics.Typeface;

import androidx.core.content.res.ResourcesCompat;

import com.groak.groak.R;

public class FontCatalog {

    private static int[] fontLevels = new int[]{
            R.font.avenir_ultralight,
            R.font.avenir_light,
            R.font.avenir_book,
            R.font.avenir_heavy,
            R.font.avenir_black
    };

    public static Typeface fontLevels(Context context, int level) {
        return Typeface.create(ResourcesCompat.getFont(context, fontLevels[level]), Typeface.NORMAL);
    }
}
