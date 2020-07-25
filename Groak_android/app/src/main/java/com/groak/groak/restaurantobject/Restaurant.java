package com.groak.groak.restaurantobject;

import com.google.firebase.firestore.DocumentReference;

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
    private long maximumOccupancy;
    private long currentOccupancy;
    private HashMap<String, Integer> occupancy;
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
        this.maximumOccupancy = (long)map.get("maximumOccupancy");
        this.currentOccupancy = (long)map.get("currentOccupancy");
        this.occupancy = (HashMap<String, Integer>)map.get("occupancy");
        this.covidGuidelines = (String)map.get("covidGuidelines");
        this.covidMessage = (String)map.get("covidMessage");
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
    public long getMaximumOccupancy() {
        return maximumOccupancy;
    }
    public long getCurrentOccupancy() {
        return currentOccupancy;
    }
    public HashMap<String, Integer> getOccupancy() {
        return occupancy;
    }
    public String getCovidGuidelines() {
        return covidGuidelines;
    }
    public String getCovidMessage() {
        return covidMessage;
    }

    public String toString() {
        String str = "";
        str += "Reference: " + reference + "\n";
        str += "Name: " + name + "\n";
        str += "Address: " + address + "\n";
        str += "Latitude: " + latitude + "\n";
        str += "Longitude: " + longitude + "\n";
        str += "Occupancy: " + occupancy + "\n";
        str += "Sales Tax: " + salesTax + "\n";
        return str;
    }
}
