package com.groak.groak.restaurantobject.restaurant;

import com.google.firebase.firestore.DocumentReference;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.groak.groak.firebase.Firebase;
import com.groak.groak.restaurantobject.dish.dishextra.DishExtra;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class Restaurant {
    private DocumentReference reference;
    private String name;
    private ArrayList<String> type;
    private String logo;
    private long salesTax;
    private HashMap<String, Object> address;
    private double latitude;
    private double longitude;
    private String covidGuidelines;
    private String covidMessage;

    public Restaurant(Map<String, Object> map) {
        this.reference = (DocumentReference)map.get("reference");
        this.name = (String)map.get("name");
        this.type = (ArrayList<String>)map.get("type");
        this.logo = (String)map.get("logo");
        this.salesTax = (long)map.get("salesTax");
        this.address = (HashMap<String, Object>)map.get("address");
        this.latitude = (double)address.get("latitude");
        this.longitude = (double)address.get("longitude");
        this.covidGuidelines = (String)map.get("covidGuidelines");
        this.covidMessage = (String)map.get("covidMessage");
    }

    public Restaurant(JsonObject json) {
        Gson gson = new Gson();

        if (json.get("reference") != null)
            this.reference = Firebase.firebase.db.document(json.get("reference").getAsString());
        if (json.get("name") != null)
            this.name = json.get("name").getAsString();
        if (json.get("type") != null)
            this.type = gson.fromJson(json.get("type").getAsJsonArray(), new TypeToken<ArrayList<String>>(){}.getType());
        if (json.get("logo") != null)
            this.logo = json.get("logo").getAsString();
        if (json.get("salesTax") != null)
            this.salesTax = json.get("salesTax").getAsLong();
        if (json.get("address") != null)
            this.address = gson.fromJson(json.get("address").getAsJsonObject(), new TypeToken<HashMap<String, Object>>(){}.getType());
        if (json.get("latitude") != null)
            this.latitude = json.get("latitude").getAsDouble();
        if (json.get("longitude") != null)
            this.longitude = json.get("longitude").getAsDouble();
        if (json.get("covidGuidelines") != null)
            this.covidGuidelines = json.get("covidGuidelines").getAsString();
        if (json.get("covidMessage") != null)
            this.covidMessage = json.get("covidMessage").getAsString();
    }

    public DocumentReference getReference() {
        return reference;
    }
    public String getName() {
        return name;
    }
    public ArrayList<String> getType() {
        return type;
    }
    public String getLogo() {
        return logo;
    }
    public long getSalesTax() {
        return salesTax;
    }
    public HashMap<String, Object> getAddress() {
        return address;
    }
    public double getLatitude() {
        return latitude;
    }
    public double getLongitude() {
        return longitude;
    }
    public String getCovidGuidelines() {
        return covidGuidelines;
    }
    public String getCovidMessage() {
        return covidMessage;
    }

    @Override
    public String toString() {
        return "Restaurant{" +
                "reference=" + reference +
                ", name='" + name + '\'' +
                ", type=" + type +
                ", logo='" + logo + '\'' +
                ", salesTax=" + salesTax +
                ", address=" + address +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", covidGuidelines='" + covidGuidelines + '\'' +
                ", covidMessage='" + covidMessage + '\'' +
                '}';
    }
}
