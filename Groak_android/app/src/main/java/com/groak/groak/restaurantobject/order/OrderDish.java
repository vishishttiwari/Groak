package com.groak.groak.restaurantobject.order;

import com.google.firebase.Timestamp;
import com.google.firebase.firestore.DocumentReference;
import com.groak.groak.restaurantobject.cart.CartDish;
import com.groak.groak.restaurantobject.cart.CartDishExtra;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class OrderDish {
    private String reference;
    private String name;
    private DocumentReference dishReference;
    private double price;
    private long quantity;
    private ArrayList<OrderDishExtra> extras;
    private Timestamp created;
    private boolean local;

    public OrderDish() {
        this.reference = null;
        this.name = "";
        this.dishReference = null;
        this.price = -1;
        this.quantity = -1;
        this.extras = new ArrayList<>();
        this.created = null;
        this.local = false;
    }

    public OrderDish(Map<String, Object> map) {
        this.reference = (String)map.get("reference");
        this.name = (String)map.get("name");
        this.dishReference = (DocumentReference)map.get("dishReference");
        this.price = (Double)map.get("price");
        this.quantity = (Long)map.get("quantity");
        this.created = (Timestamp)map.get("created");
        this.local = false;

        this.extras = new ArrayList<>();
        ArrayList<Map<String, Object>> tempExtras = (ArrayList<Map<String, Object>>)map.get("extras");
        for (Map<String, Object> extra: tempExtras)
            this.extras.add(new OrderDishExtra(extra));
    }

    public OrderDish(CartDish dish) {
        this.reference = UUID.randomUUID().toString();
        this.name = dish.getName();
        this.dishReference = dish.getDishReference();
        this.price = dish.getPrice();
        this.quantity = dish.getQuantity();
        this.created = Timestamp.now();
        this.local = false;

        this.extras = new ArrayList<>();
        for (CartDishExtra extra: dish.getExtras())
            this.extras.add(new OrderDishExtra(extra));
    }

    public boolean success() {
        if (reference == null || reference.length() == 0) return false;
        if (name == null || name.length() == 0) return false;
        if (dishReference == null || dishReference.getPath().length() == 0) return false;
        if (price < 0) return false;
        if (quantity <= 0) return false;
        return true;
    }

    public HashMap<String, Object> getDictionary() {
        HashMap<String, Object> dictionary = new HashMap<>();

        dictionary.put("name", name);
        dictionary.put("reference", reference);
        dictionary.put("dishReference", dishReference);
        dictionary.put("price", price);
        dictionary.put("quantity", quantity);
        ArrayList<HashMap<String, Object>> extrasDict = new ArrayList<>();
        for (OrderDishExtra extra: extras)
            extrasDict.add(extra.getDictionary());
        dictionary.put("extras", extrasDict);
        dictionary.put("created", created);

        return dictionary;
    }

    public String getReference() {
        return reference;
    }
    public String getName() {
        return name;
    }
    public DocumentReference getDishReference() {
        return dishReference;
    }
    public double getPrice() {
        return price;
    }
    public long getQuantity() {
        return quantity;
    }
    public ArrayList<OrderDishExtra> getExtras() {
        return extras;
    }
    public Timestamp getCreated() {
        return created;
    }
    public boolean isLocal() {
        return local;
    }

    public void setLocal(boolean local) {
        this.local = local;
    }

    @Override
    public String toString() {
        return "OrderDish{" +
                "reference='" + reference + '\'' +
                ", name='" + name + '\'' +
                ", dishReference=" + dishReference +
                ", price=" + price +
                ", quantity=" + quantity +
                ", extras=" + extras +
                ", created=" + created +
                ", local=" + local +
                '}';
    }
}
