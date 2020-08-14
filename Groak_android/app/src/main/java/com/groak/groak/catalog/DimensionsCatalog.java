package com.groak.groak.catalog;

import android.app.Activity;
import android.content.res.Resources;
import android.os.Build;
import android.util.DisplayMetrics;

public class DimensionsCatalog {
    public static int screenWidth = Resources.getSystem().getDisplayMetrics().widthPixels;
    public static int screenHeight = Resources.getSystem().getDisplayMetrics().heightPixels;

    public static int specialInstructions = 300;

    public static int distanceBetweenElements = 20;
    public static int imageHeights = 200 + Math.round(screenWidth/200)*100;

    public static int headerHeight = 150;
    public static int headerIconHeight = 70;
    public static int headerTextSize = 28;

    public static int elevation = 10;

    public static int getSoftButtonsBarSizePort(Activity activity) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            DisplayMetrics metrics = new DisplayMetrics();
            activity.getWindowManager().getDefaultDisplay().getMetrics(metrics);
            int usableHeight = metrics.heightPixels;
            activity.getWindowManager().getDefaultDisplay().getRealMetrics(metrics);
            int realHeight = metrics.heightPixels;
            if (realHeight > usableHeight)
                return realHeight - usableHeight;
            else
                return 0;
        }
        return 100;
    }
}
