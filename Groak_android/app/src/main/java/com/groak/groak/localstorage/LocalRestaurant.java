/**
 * This saves the restaurant and other stuff whenever qr code is scanned
 */
package com.groak.groak.localstorage;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;

import com.google.firebase.firestore.DocumentReference;
import com.groak.groak.R;
import com.groak.groak.activity.restaurant.RestaurantListActivity;
import com.groak.groak.catalog.Catalog;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.firebase.firestoreAPICalls.FirestoreAPICallsOrders;
import com.groak.groak.firebase.firestoreAPICalls.FirestoreAPICallsQRCodes;
import com.groak.groak.firebase.firestoreAPICalls.FirestoreAPICallsRequests;
import com.groak.groak.firebase.firestoreAPICalls.FirestoreAPICallsTables;
import com.groak.groak.notification.UserNotification;
import com.groak.groak.restaurantobject.MenuCategory;
import com.groak.groak.restaurantobject.QRCode;
import com.groak.groak.restaurantobject.restaurant.Restaurant;
import com.groak.groak.restaurantobject.session.SessionId;
import com.groak.groak.restaurantobject.table.Table;
import com.groak.groak.restaurantobject.cart.Cart;
import com.groak.groak.restaurantobject.cart.CartDish;
import com.groak.groak.restaurantobject.order.Order;
import com.groak.groak.restaurantobject.order.OrderComment;
import com.groak.groak.restaurantobject.order.OrderDish;
import com.groak.groak.restaurantobject.request.Requests;

import java.util.ArrayList;

public class LocalRestaurant {
    public static Restaurant restaurant = null;
    public static ArrayList<MenuCategory> categories = new ArrayList();
    public static Table table = null;
    public static QRCode qrCode = null;
    public static DocumentReference orderReference = null;
    public static DocumentReference requestReference = null;
    public static Cart cart = new Cart();
    public static Order order = new Order();
    public static Requests requests = new Requests();
    public static boolean requestNotifications = false;
    public static SessionId sessionId = null;


    /**
     * Called when qr code scanned
     *
     * @param context
     * @param restaurant
     * @param tableId
     * @param qrCodeId
     * @param groakCallback
     */
    public static void enterRestaurant(Context context, Restaurant restaurant, String tableId, String qrCodeId, GroakCallback groakCallback) {
        cart = new Cart();
        RealmWrapper.deleteOldDishesAndComments(context);
        LocalRestaurant.restaurant = restaurant;
        FirestoreAPICallsQRCodes.fetchQRCodeFirestoreAPI(restaurant.getReference().getId(), qrCodeId, new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
                LocalRestaurant.qrCode = (QRCode) object;
                LocalRestaurant.qrCode.downloadCategories(new GroakCallback() {
                    @Override
                    public void onSuccess(Object object) {
                        if (qrCode.isAvailable() && qrCode.getCategories() != null) {
                            for (MenuCategory category: qrCode.getCategories()) {
                                if (category.checkIfCategoryIsAvailable())
                                    LocalRestaurant.categories.add(category);
                            }
                        }
                        FirestoreAPICallsTables.fetchTableFirestoreAPI(tableId, new GroakCallback() {
                            @Override
                            public void onSuccess(Object object) {
                                LocalRestaurant.setTable((Table)object);
                                LocalRestaurant.setSessionId(context);
                                FirestoreAPICallsOrders.fetchOrderFirestoreAPI(context, new GroakCallback() {
                                    @Override
                                    public void onSuccess(Object object) {
                                        LocalRestaurant.order = (Order)object;
                                        FirestoreAPICallsRequests.fetchRequestFirestoreAPI(context, new GroakCallback() {
                                            @Override
                                            public void onSuccess(Object object) {
                                                LocalRestaurant.requests = (Requests)object;
                                                groakCallback.onSuccess(null);
                                            }
                                            @Override
                                            public void onFailure(Exception e) {
                                                groakCallback.onFailure(e);
                                            }
                                        });
                                    }
                                    @Override
                                    public void onFailure(Exception e) {
                                        groakCallback.onFailure(e);
                                    }
                                });
                            }
                            @Override
                            public void onFailure(Exception e) {
                                groakCallback.onFailure(e);
                            }
                        });
                    }
                    @Override
                    public void onFailure(Exception e) {
                        groakCallback.onFailure(e);
                    }
                });
            }
            @Override
            public void onFailure(Exception e) {
                groakCallback.onFailure(e);
            }
        });
    }

    /**
     * This is called when user pressed leave restaurant
     *
     * @param context
     */
    public static void leaveRestaurant(Context context) {
        Catalog.alert(context, "Leaving restaurant?", "Are you sure you would like to leave the restaurant?. Your cart will be lost", new GroakCallback() {
            @Override
            public void onSuccess(Object object) {
                leaveRestaurantWithoutNotice(context);
            }
            @Override
            public void onFailure(Exception e) {
            }
        });
    }

    /**
     * User is only given a toast that you are been thrown out of the restaurant
     * @param context
     */
    public static void leaveRestaurantWithoutAsking(Context context) {
        Catalog.toast(context, "It seems you have left the restaurant. Please scan again to see the menu if you have not.");

        leaveRestaurantWithoutNotice(context);
    }

    /**
     * User is thrown out without notice.
     *
     * @param context
     */
    public static void leaveRestaurantWithoutNotice(Context context) {
        resetRestaurant();

        Intent intent = new Intent(context, RestaurantListActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        intent.putExtra("EXIT", true);
        context.startActivity(intent);
        ((Activity)context).overridePendingTransition(R.anim.slide_in_up, R.anim.slide_out_down);
    }

    /**
     * Everything in restaurant is reset
     */
    public static void resetRestaurant() {
        if (sessionId != null && sessionId.getSessionId() != null)
            UserNotification.unsubscribe(sessionId.getSessionId());

        restaurant = null;
        categories = new ArrayList();
        table = null;
        orderReference = null;
        requestReference = null;
        cart = new Cart();
        order = new Order();
        requests = new Requests();
        requestNotifications = false;
        sessionId = null;

        UserNotification.count = 0;

        FirestoreAPICallsOrders.unsubscribe();
        FirestoreAPICallsRequests.unsubscribe();
    }

    /**
     * Resets table
     *
     * @param table
     */
    private static void setTable(Table table) {
        LocalRestaurant.table = table;
        LocalRestaurant.orderReference = table.getOrderReference();
        LocalRestaurant.requestReference = table.getRequestReference();
    }

    /**
     * Resets session id. Gets all previous session ids from previous day and unsubscribe from that.
     *
     * @param context
     */
    private static void setSessionId(Context context) {
        LocalRestaurant.sessionId = new SessionId();
        FirestoreAPICallsOrders.seatedFirestoreAPI();
        RealmWrapper.addSessionId(context, LocalRestaurant.sessionId);
        UserNotification.subscribe(sessionId.getSessionId());
        ArrayList<SessionId> oldSessionIds = RealmWrapper.downloadOldSessionIds(context);
        for (SessionId sessionId: oldSessionIds)
            UserNotification.unsubscribe(sessionId.getSessionId());
        RealmWrapper.deleteOldSessionIds(context);
    }

    /**
     * Gets the total price from the cart
     *
     * @return
     */
    public static double calculateCartTotalPrice() {
        double price = 0;
        for (CartDish dish: cart.getDishes())
            price += dish.getPrice();
        return price;
    }

    /**
     * Calculates the total order price
     *
     * @param tableOrder
     * @return
     */
    public static double calculateOrderTotalPrice(boolean tableOrder) {
        double price = 0;
        if (tableOrder) {
            for (OrderDish dish : order.getDishes())
                price += dish.getPrice();
        } else {
            for (OrderDish dish : order.getDishes())
                if (dish.isLocal()) price += dish.getPrice();
        }
        return price;
    }

    /**
     * This only gets the local order dish at a specific position
     *
     * @param position
     * @return
     */
    public static OrderDish getLocalOrderDish(int position) {
        int finalPosition = position;
        if (LocalRestaurant.order != null) {
            for (OrderDish dish : order.getDishes()) {
                if (dish.isLocal()) {
                    if (finalPosition == 0) return dish;
                    else finalPosition--;
                }
            }
        }
        return null;
    }

    /**
     * This gets total local dishes count
     *
     * @return
     */
    public static int getLocalOrderDishesCount() {
        int finalDishes = 0;
        if (LocalRestaurant.order != null) {
            for (OrderDish dish : order.getDishes()) {
                if (dish.isLocal())
                    finalDishes++;
            }
        }
        return finalDishes;
    }

    /**
     * This only gets the local order comment at a specific position
     *
     * @param position
     * @return
     */
    public static OrderComment getLocalOrderComment(int position) {
        int finalPosition = position;
        if (LocalRestaurant.order != null) {
            for (OrderComment comment : order.getComments()) {
                if (comment.isLocal()) {
                    if (finalPosition == 0) return comment;
                    else finalPosition--;
                }
            }
        }
        return null;
    }

    /**
     * This gets total local comments count
     *
     * @return
     */
    public static int getLocalOrderCommentsCount() {
        int finalComments = 0;
        if (LocalRestaurant.order != null) {
            for (OrderComment comment : order.getComments()) {
                if (comment.isLocal())
                    finalComments++;
            }
        }
        return finalComments;
    }
}
