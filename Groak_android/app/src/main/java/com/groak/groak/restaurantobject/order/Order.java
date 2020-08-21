/**
 * Order
 */
package com.groak.groak.restaurantobject.order;

import com.google.firebase.Timestamp;
import com.google.firebase.firestore.DocumentReference;
import com.groak.groak.restaurantobject.TableStatus;
import com.groak.groak.restaurantobject.cart.Cart;
import com.groak.groak.restaurantobject.cart.CartDish;

import java.util.ArrayList;
import java.util.Map;

public class Order {
    private DocumentReference reference;
    private ArrayList<OrderComment> comments;
    private ArrayList<OrderDish> dishes;
    private long items;
    private DocumentReference restaurantReference;
    private String tableName;
    private DocumentReference tableReference;
    private DocumentReference requestReference;
    private Timestamp updated;
    private TableStatus status;
    private ArrayList<String> sessionIds;
    private boolean newRequest;
    private boolean newRequestForUser;
    private Timestamp serveTime;

    public Order() {
        this.reference = null;
        this.comments = new ArrayList<>();
        this.dishes = new ArrayList<>();
        this.items = 0;
        this.restaurantReference = null;
        this.tableName = "";
        this.tableReference = null;
        this.requestReference = null;
        this.updated = null;
        this.status = TableStatus.available;
        this.sessionIds = new ArrayList<>();
        this.newRequest = false;
        this.newRequestForUser = false;
        this.serveTime = null;
    }

    public Order(Map<String, Object> map) {
        this.reference = (DocumentReference)map.get("reference");
        this.comments = new ArrayList<>();
        ArrayList<Map<String, Object>> tempComments = (ArrayList<Map<String, Object>>)map.get("comments");
        for (Map<String, Object> comment: tempComments) {
            this.comments.add(new OrderComment(comment));
        }
        this.dishes = new ArrayList<>();
        ArrayList<Map<String, Object>> tempDishes = (ArrayList<Map<String, Object>>)map.get("dishes");
        for (Map<String, Object> dish: tempDishes) {
            this.dishes.add(new OrderDish(dish));
        }
        this.items = (Long)map.get("items");
        this.restaurantReference = (DocumentReference)map.get("restaurantReference");
        this.tableName = (String)map.get("table");
        this.tableReference = (DocumentReference)map.get("tableReference");
        this.requestReference = (DocumentReference)map.get("requestReference");
        this.updated = (Timestamp)map.get("updated");
        this.status = TableStatus.fromString((String)map.get("status"));
        this.sessionIds = (ArrayList<String>)map.get("sessionIds");
        this.newRequest = (boolean)map.get("newRequest");
        this.newRequestForUser = (boolean)map.get("newRequestForUser");
        this.serveTime = (Timestamp)map.get("serveTime");
    }

    public Order(Cart cart) {
        this.reference = null;
        this.restaurantReference = null;
        this.tableName = "";
        this.tableReference = null;
        this.requestReference = null;
        this.updated = null;
        this.status = TableStatus.available;
        this.sessionIds = null;
        this.newRequest = false;
        this.newRequestForUser = false;
        this.serveTime = null;

        this.comments = new ArrayList<>();
        this.dishes = new ArrayList<>();

        if (cart.getComment().length() > 0)
            comments.add(new OrderComment(cart.getComment()));
        for (CartDish dish: cart.getDishes())
            dishes.add(new OrderDish(dish));

        this.items = cart.getDishes().size();
    }

    public boolean success() {
        for (OrderComment comment: this.comments)
            if (!comment.success()) return false;
        for (OrderDish dish: this.dishes)
            if (!dish.success()) return false;
        return true;
    }

    public DocumentReference getReference() {
        return reference;
    }
    public ArrayList<OrderComment> getComments() {
        return comments;
    }
    public ArrayList<OrderDish> getDishes() {
        return dishes;
    }
    public long getItems() {
        return items;
    }
    public DocumentReference getRestaurantReference() {
        return restaurantReference;
    }
    public String getTableName() {
        return tableName;
    }
    public DocumentReference getTableReference() {
        return tableReference;
    }
    public DocumentReference getRequestReference() {
        return requestReference;
    }
    public Timestamp getUpdated() {
        return updated;
    }
    public TableStatus getStatus() {
        return status;
    }
    public boolean isNewRequest() {
        return newRequest;
    }
    public Timestamp getServeTime() {
        return serveTime;
    }
    public boolean isNewRequestForUser() {
        return newRequestForUser;
    }
    public ArrayList<String> getSessionIds() {
        return sessionIds;
    }

    @Override
    public String toString() {
        return "Order{" +
                "reference=" + reference +
                ", comments=" + comments +
                ", dishes=" + dishes +
                ", items=" + items +
                ", restaurantReference=" + restaurantReference +
                ", tableName='" + tableName + '\'' +
                ", tableReference=" + tableReference +
                ", requestReference=" + requestReference +
                ", updated=" + updated +
                ", status=" + status +
                ", sessionIds=" + sessionIds +
                ", newRequest=" + newRequest +
                ", newRequestForUser=" + newRequestForUser +
                ", serveTime=" + serveTime +
                '}';
    }
}
