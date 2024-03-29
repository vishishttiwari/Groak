/**
 * The functions here are used all over the project
 */
package com.groak.groak.catalog;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Bitmap;
import android.graphics.PorterDuff;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Environment;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.groak.groak.catalog.groakUIClasses.LoadingView;
import com.groak.groak.restaurantobject.cart.CartDishExtra;
import com.groak.groak.restaurantobject.cart.CartDishExtraOption;
import com.groak.groak.restaurantobject.order.OrderDishExtra;
import com.groak.groak.restaurantobject.order.OrderDishExtraOption;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;

public class Catalog {
    public static String TAG = "Groak";

    /**
     * This cell is used as a special id for special instructions cell in the whole project
     */
    public static String specialInstructionsId = "specialInstructionsCellIdABCD1234";

    public static String frontDoorQRMenuPageId = "front-door-qr-menupage";

    public static void jsonPrettyPrint(String json) {
        Gson gson = new GsonBuilder().setPrettyPrinting().create(); // pretty print
        String prettyJson = gson.toJson(json);
        System.out.println(prettyJson);
    }

    /**
     * Used for creating toast
     *
     * @param activity
     * @param text
     */
    public static void toast(Activity activity, String text) {
        toast(activity, text);
    }

    /**
     * Used for creating toast
     *
     * @param context
     * @param text
     */
    public static void toast(Context context, String text) {
        Toast toast = Toast.makeText(context, text, Toast.LENGTH_SHORT);
        View view = toast.getView();
        view.getBackground().setColorFilter(ColorsCatalog.grayColor, PorterDuff.Mode.SRC_IN);

        TextView v = (TextView) toast.getView().findViewById(android.R.id.message);
        v.setTextColor(ColorsCatalog.whiteColor);
        v.setGravity(Gravity.CENTER);

        toast.show();
    }

    /**
     * Used for creating alert
     *
     * @param context
     * @param title
     * @param message
     * @param callback
     */
    public static void alert(Context context, String title, String message, final GroakCallback callback) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context)
                .setTitle(title)
                .setMessage(message)

                .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        callback.onSuccess(null);
                    }
                })

                .setNegativeButton(android.R.string.no, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        callback.onFailure(null);
                    }
                });

        AlertDialog alertDialog = builder.create();
        alertDialog.setCancelable(false);
        alertDialog.setCanceledOnTouchOutside(false);
        alertDialog.show();
    }

    /**
     * Used for alert dialog with loading of pizza image
     *
     * @param context
     * @param title
     * @return
     */
    public static AlertDialog loading(Context context, String title) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        View view = new LoadingView(context, title);
        builder.setView(view);

        AlertDialog alertDialog = builder.create();
        alertDialog.setCancelable(false);
        alertDialog.setCanceledOnTouchOutside(false);
        alertDialog.show();

        return alertDialog;
    }

    /**
     * This is used to represent a price in correct cost format
     *
     * @param price
     * @return
     */
    public static String priceInString(double price) {
        return String.format( "$%.2f", price );
    }

    /**
     * Calculates the total price for dishes
     *
     * @param pricePerItem
     * @param quantity
     * @return
     */
    public static double calculateTotalPriceOfDish(double pricePerItem, int quantity) {
        return Math.round((double)quantity * pricePerItem * 100)/100;
    }

    /**
     * Used to represent nutrition in String
     *
     * @param price
     * @return
     */
    public static String nutritionInString(double price) {
        return String.format( "%.0fkCal", price );
    }

    /**
     * This function is used to show all the extras selected for a dish in cart and in order
     *
     * @param dishExtras
     * @param showSpecialInstructions
     * @return
     */
    public static String showExtras(ArrayList<CartDishExtra> dishExtras, boolean showSpecialInstructions) {
        String str = "";
        for (CartDishExtra extra: dishExtras) {
            if (extra.getOptions().size() > 0) {
                if (!extra.getTitle().equals(Catalog.specialInstructionsId)) {
                    str += extra.getTitle() + ":\n";
                    for (CartDishExtraOption option: extra.getOptions()) {
                        str += "\t\t\t-" + option.getTitle() + ": " + Catalog.priceInString(option.getPrice()) + "\n";
                    }
                } else {
                    if (showSpecialInstructions) {
                        str += "Special Instructions:\n";
                        for (CartDishExtraOption option: extra.getOptions()) {
                            str += "\t\t\t-" + option.getTitle() + ": " + Catalog.priceInString(option.getPrice()) + "\n";
                        }
                    }
                }
            }
        }

        if (str.length() > 2) {
            if (str.endsWith("\n"))
                return str.substring(0, str.length() - 1);
            else
                return str;
        } else {
            return str;
        }
    }

    /**
     * This function is used to show all the extras selected for a dish in cart and in order
     *
     * @param dishExtras
     * @param showSpecialInstructions
     * @return
     */
    public static String showExtras(ArrayList<OrderDishExtra> dishExtras, boolean showSpecialInstructions, boolean order) {
        String str = "";
        for (OrderDishExtra extra: dishExtras) {
            if (extra.getOptions().size() > 0) {
                if (!extra.getTitle().equals(Catalog.specialInstructionsId)) {
                    str += extra.getTitle() + ":\n";
                    for (OrderDishExtraOption option: extra.getOptions()) {
                        str += "\t\t\t-" + option.getTitle() + ": " + Catalog.priceInString(option.getPrice()) + "\n";
                    }
                } else {
                    if (showSpecialInstructions) {
                        str += "Special Instructions:\n";
                        for (OrderDishExtraOption option: extra.getOptions()) {
                            str += "\t\t\t-" + option.getTitle() + ": " + Catalog.priceInString(option.getPrice()) + "\n";
                        }
                    }
                }
            }
        }

        if (str.length() > 2) {
            if (str.endsWith("\n"))
                return str.substring(0, str.length() - 1);
            else
                return str;
        } else {
            return str;
        }
    }

    /**
     * Used for showing special instructions
     *
     * @param dishExtras
     * @return
     */
    public static String showSpecialInstructions(ArrayList<CartDishExtra> dishExtras) {
        for (CartDishExtra extra: dishExtras) {
            if (extra.getOptions().size() > 0) {
                if (extra.getTitle().equals(Catalog.specialInstructionsId)) {
                    for (CartDishExtraOption option : extra.getOptions())
                        return option.getTitle();
                }
            }
        }
        return null;
    }

    /**
     * Used for changing special instruction. Used for when order is placed.
     *
     * @param dishExtras
     * @param specialInstructions
     */
    public static void changeSpecialInstructions(ArrayList<CartDishExtra> dishExtras, String specialInstructions) {
        CartDishExtraOption option = new CartDishExtraOption(specialInstructions, 0, 0);
        for (int i = 0; i < dishExtras.size(); i++) {
            CartDishExtra extra = dishExtras.get(i);
            if (extra.getOptions().size() > 0) {
                if (extra.getTitle().equals(Catalog.specialInstructionsId)) {
                    extra.getOptions().clear();
                    extra.getOptions().add(option);
                }
            }
        }
    }

    /**
     * This function is used to an image in internal storage in a directory called Demo
     *
     * @param context
     * @param bm
     * @throws IOException
     */
    public static void saveImageToInternalStorage(Context context, Bitmap bm) throws IOException {
        File path = Environment.getExternalStorageDirectory();
        File dir = new File(path + "/Demo/");
        dir.mkdir();
        File file = new File(dir, System.currentTimeMillis() + ".png");

        FileOutputStream out = new FileOutputStream(file);
        try{
            bm.compress(Bitmap.CompressFormat.PNG, 100, out); // Compress Image
            out.flush();
            out.close();

            MediaScannerConnection.scanFile(context, new String[] { file.getAbsolutePath() }, null,new MediaScannerConnection.OnScanCompletedListener() {
                public void onScanCompleted(String path, Uri uri) {
                    Log.i("ExternalStorage", "Scanned " + path + ":");
                    Log.i("ExternalStorage", "-> uri=" + uri);
                }
            });
        } catch(Exception e) {
            throw new IOException();
        }
    }
}
