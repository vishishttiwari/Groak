/**
 * This is used for finding any qr in the images or not. If it fines a valid wr then returns with success
 */
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
                                case FirebaseVisionBarcode.TYPE_URL:
                                    if (barcode != null && barcode.getRawValue() != null) {
                                        String finalStr = barcode.getUrl().getUrl().replace("https://", "");
                                        finalStr = finalStr.replace("http://", "");
                                        if (checkGroakElements(finalStr, restaurantId)) {
                                            groakCallback.onSuccess(barcode.getRawValue());
                                        }
                                    }
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

    /**
     * Check elements of the url and sees if it is valid
     *
     * @param url
     * @param restaurantId
     * @return
     */
    public boolean checkGroakElements(String url, String restaurantId) {
        String[] urlElements = url.split("/");
        if (urlElements.length != 5) return false;
        if (!urlElements[0].equals("groakapp.com") && !urlElements[0].equals("www.groakapp.com")) return false;
        return urlElements[2].equals(restaurantId);
    }
}
