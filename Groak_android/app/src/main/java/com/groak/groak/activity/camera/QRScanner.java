package com.groak.groak.activity.camera;

import androidx.annotation.NonNull;

import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.ml.vision.FirebaseVision;
import com.google.firebase.ml.vision.barcode.FirebaseVisionBarcode;
import com.google.firebase.ml.vision.barcode.FirebaseVisionBarcodeDetector;
import com.google.firebase.ml.vision.barcode.FirebaseVisionBarcodeDetectorOptions;
import com.google.firebase.ml.vision.common.FirebaseVisionImage;
import com.groak.groak.catalog.GroakCallback;
import com.groak.groak.localstorage.LocalRestaurant;

import java.util.List;

public class QRScanner {
    FirebaseVisionBarcodeDetectorOptions options =
            new FirebaseVisionBarcodeDetectorOptions.Builder()
                    .setBarcodeFormats(
                            FirebaseVisionBarcode.FORMAT_QR_CODE)
                    .build();
    FirebaseVisionBarcodeDetector detector = FirebaseVision.getInstance().getVisionBarcodeDetector(options);

    public void scanQR(FirebaseVisionImage image, String restaurantId, GroakCallback groakCallback) {
        Task<List<FirebaseVisionBarcode>> result = detector.detectInImage(image)
                .addOnSuccessListener(new OnSuccessListener<List<FirebaseVisionBarcode>>() {
                    @Override
                    public void onSuccess(List<FirebaseVisionBarcode> barcodes) {
                        for (FirebaseVisionBarcode barcode: barcodes) {
                            int valueType = barcode.getValueType();
                            switch (valueType) {
                                case FirebaseVisionBarcode.TYPE_TEXT:
                                    if (barcode != null && barcode.getRawValue() != null) {
                                        if (checkGroakElements(barcode.getRawValue(), restaurantId)) {
                                            groakCallback.onSuccess(barcode.getRawValue());
                                        }
                                    }
                                    break;
                            }
                        }
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        groakCallback.onFailure(e);
                    }
                });
    }

    public boolean checkGroakElements(String url, String restaurantId) {
        String[] urlElements = url.split("/");
        if (urlElements.length != 5) return false;
        if (!urlElements[0].equals("groakapp.com")) return false;
        return urlElements[2].equals(restaurantId);
    }
}
