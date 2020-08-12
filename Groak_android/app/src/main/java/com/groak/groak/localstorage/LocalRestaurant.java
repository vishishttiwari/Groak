package com.groak.groak.localstorage;

import com.google.firebase.firestore.DocumentReference;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.firebase.firestoreAPICalls.FirestoreAPICallsRestaurants;
import com.groak.groak.firebase.firestoreAPICalls.FirestoreAPICallsTables;
import com.groak.groak.restaurantobject.MenuCategory;
import com.groak.groak.restaurantobject.Restaurant;
import com.groak.groak.restaurantobject.Table;
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
    public static DocumentReference orderReference = null;
    public static DocumentReference requestReference = null;
    public static Cart cart = new Cart();
    public static Order order = new Order();
    public static Requests requests = new Requests();

//    static {
//        Restaurant restaurant;
//
//        FirestoreAPICallsRestaurants.fetchRestaurantFirestoreAPI("oTuolY9ebBObRgxhmxRYboyGifv1", new GroakCallback() {
//            @Override
//            public void onSuccess(Object object) {
//                setRestaurant((Restaurant)object);
//            }
//            @Override
//            public void onFailure(Exception e) {
//            }
//        });
//
//        FirestoreAPICallsTables.fetchTableFirestoreAPI("r18cb7350q82598q0cczmo", new GroakCallback() {
//            @Override
//            public void onSuccess(Object object) {
//                setTable((Table)object);
//            }
//            @Override
//            public void onFailure(Exception e) {
//            }
//        });
//    }

    public static void createRestaurant(Restaurant restaurant, Table table) {
        LocalRestaurant.restaurant = restaurant;
        LocalRestaurant.table = table;
        LocalRestaurant.orderReference = table.getOrderReference();
        LocalRestaurant.requestReference = table.getRequestReference();
    }

    public static void setTable(Table table) {
        LocalRestaurant.table = table;
        LocalRestaurant.orderReference = table.getOrderReference();
        LocalRestaurant.requestReference = table.getRequestReference();
    }

    public static double calculateCartTotalPrice() {
        double price = 0;
        for (CartDish dish: cart.getDishes())
            price += dish.getPrice();
        return price;
    }

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
