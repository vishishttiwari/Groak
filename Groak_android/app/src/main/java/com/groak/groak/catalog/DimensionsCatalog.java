package com.groak.groak.catalog;

import android.content.res.Resources;

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
}
