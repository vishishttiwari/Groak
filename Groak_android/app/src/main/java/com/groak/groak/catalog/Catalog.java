package com.groak.groak.catalog;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.transition.Slide;
import android.view.Gravity;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.groak.groak.restaurantobject.dish.cart.CartDishExtra;
import com.groak.groak.restaurantobject.dish.cart.CartDishExtraOption;

import java.util.ArrayList;

public class Catalog {
    public static String TAG = "Groak";
    // This cell is used as a special id for special instructions cell in the whole project
    public static String specialInstructionsId = "specialInstructionsCellIdABCD1234";

    public static void jsonPrettyPrint(String json) {
        Gson gson = new GsonBuilder().setPrettyPrinting().create(); // pretty print
        String prettyJson = gson.toJson(json);
        System.out.println(prettyJson);
    }

    public static void toast(Activity activity, String text) {
        toast(activity, text);
    }

    public static void toast(Context context, String text) {
        Toast toast = Toast.makeText(context, text, Toast.LENGTH_LONG);
        View view = toast.getView();
        view.getBackground().setColorFilter(ColorsCatalog.grayColor, PorterDuff.Mode.SRC_IN);

        TextView v = (TextView) toast.getView().findViewById(android.R.id.message);
        v.setTextColor(ColorsCatalog.whiteColor);

        toast.show();
    }

    public static void alert(Context context, String title, String message, final GroakCallback callback) {
        new AlertDialog.Builder(context)
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
                })
                .show();
    }

    public static String priceInString(double price) {
        return String.format( "$%.2f", price );
    }

    public static double calculateTotalPriceOfDish(double pricePerItem, int quantity) {
        return Math.round((double)quantity * pricePerItem * 100)/100;
    }

    public static String nutritionInString(double price) {
        return String.format( "%.0fkCal", price );
    }

    // This function is used to show all the xtras selected for a dish in cart and in order
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
}