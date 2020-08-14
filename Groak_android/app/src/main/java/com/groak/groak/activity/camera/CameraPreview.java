package com.groak.groak.activity.camera;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.SurfaceTexture;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraCaptureSession;
import android.hardware.camera2.CameraCharacteristics;
import android.hardware.camera2.CameraDevice;
import android.hardware.camera2.CameraManager;
import android.hardware.camera2.CaptureRequest;
import android.hardware.camera2.params.StreamConfigurationMap;
import android.os.Build;
import android.os.Handler;
import android.os.HandlerThread;
import android.util.Size;
import android.util.SparseIntArray;
import android.view.Surface;
import android.view.TextureView;
import android.view.View;
import android.widget.RelativeLayout;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.core.content.ContextCompat;

import com.groak.groak.catalog.Catalog;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class CameraPreview extends ConstraintLayout {
    private TextureView cameraPreview;
    private TextureView.SurfaceTextureListener cameraPreviewChangeListener;
    private CameraDevice cameraDev;
    private CameraDevice.StateCallback cameraDeviceStateCallback;
    private String cameraId;
    private static final int REQUEST_CAMERA_PERMISSION_RESULT = 0;
    private Size previewSize;
    private CaptureRequest.Builder captureRequestBuilder;
    private HandlerThread cameraBackgroundThread;
    private Handler cameraBackgroundHandler;
    private static SparseIntArray ORIENTATIONS = new SparseIntArray();
    static {
        ORIENTATIONS.append(Surface.ROTATION_0, 0);
        ORIENTATIONS.append(Surface.ROTATION_90, 90);
        ORIENTATIONS.append(Surface.ROTATION_180, 180);
        ORIENTATIONS.append(Surface.ROTATION_270, 270);
    }
    private static class CompareSizeByArea implements Comparator<Size> {
        @Override
        public int compare(Size size, Size t1) {
            return Long.signum((long) size.getWidth() * size.getHeight() / (long) t1.getWidth() * t1.getHeight());
        }
    }

    private String cameraError = "Error occurred while switching the camera on";
    private String cameraRequest = "Please allow camera for scanning the QR Code";

    public CameraPreview(Context context) {
        super(context);

        setupViews();

        setupInitialLayout();
    }

    public void onResume() {
        startBackgroundThread();

        if (cameraPreview.isAvailable()) {
            try {
                setupCamera(cameraPreview.getWidth(), cameraPreview.getHeight());
                connectCamera();
            } catch (Exception e) {
                Catalog.toast(getContext(), cameraError);
            }
        } else {
            cameraPreview.setSurfaceTextureListener(cameraPreviewChangeListener);
        }
    }

    public void onPause() {
        closeCamera();

        try {
            stopBackgroundThread();
        } catch (Exception e) {
            Catalog.toast(getContext(), "Error occurred while using phone camera");
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        View decorView = ((Activity)getContext()).getWindow().getDecorView();
        if (hasFocus) {
            decorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_FULLSCREEN
            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
        }
    }

    private void setupViews() {
        cameraPreview = new TextureView(getContext());
        cameraPreview.setId(View.generateViewId());
        cameraPreview.setLayoutParams(new RelativeLayout.LayoutParams(0, 0));

        cameraPreviewChangeListener = new TextureView.SurfaceTextureListener() {
            @Override
            public void onSurfaceTextureAvailable(SurfaceTexture surfaceTexture, int i, int i1) {
                try {
                    setupCamera(cameraPreview.getWidth(), cameraPreview.getHeight());
                    connectCamera();
                } catch (Exception e) {
                    Catalog.toast(getContext(), cameraError);
                }
            }

            @Override
            public void onSurfaceTextureSizeChanged(SurfaceTexture surfaceTexture, int i, int i1) {

            }

            @Override
            public boolean onSurfaceTextureDestroyed(SurfaceTexture surfaceTexture) {
                return false;
            }

            @Override
            public void onSurfaceTextureUpdated(SurfaceTexture surfaceTexture) {

            }
        };

        cameraDeviceStateCallback = new CameraDevice.StateCallback() {
            @Override
            public void onOpened(@NonNull CameraDevice cameraDevice) {
                cameraDev = cameraDevice;
                try {
                    startPreview();
                } catch (CameraAccessException e) {
                    Catalog.toast(getContext(), cameraError);
                }
            }

            @Override
            public void onDisconnected(@NonNull CameraDevice cameraDevice) {
                cameraDevice.close();
                cameraDev = null;
            }

            @Override
            public void onError(@NonNull CameraDevice cameraDevice, int i) {
                cameraDevice.close();
                cameraDev = null;
                Catalog.toast(getContext(), cameraError);
            }
        };

        addView(cameraPreview);
    }

    private void setupInitialLayout() {
        ConstraintSet set = new ConstraintSet();
        set.clone(this);

        set.connect(cameraPreview.getId(), ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP);
        set.connect(cameraPreview.getId(), ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        set.connect(cameraPreview.getId(), ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        set.connect(cameraPreview.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM);

        set.applyTo(this);
    }

    private void startPreview() throws CameraAccessException {
        SurfaceTexture surfaceTexture = cameraPreview.getSurfaceTexture();
        surfaceTexture.setDefaultBufferSize(previewSize.getWidth(), previewSize.getHeight());
        Surface previewSurface = new Surface(surfaceTexture);

        captureRequestBuilder = cameraDev.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW);
        captureRequestBuilder.addTarget(previewSurface);

        cameraDev.createCaptureSession(Arrays.asList(previewSurface), new CameraCaptureSession.StateCallback() {
            @Override
            public void onConfigured(@NonNull CameraCaptureSession cameraCaptureSession) {
                try {
                    cameraCaptureSession.setRepeatingRequest(captureRequestBuilder.build(), null, cameraBackgroundHandler);
                } catch (CameraAccessException e) {
                    Catalog.toast(getContext(), cameraError);
                }
            }

            @Override
            public void onConfigureFailed(@NonNull CameraCaptureSession cameraCaptureSession) {
                Catalog.toast(getContext(), cameraError);
            }
        }, null);
    }

    private void setupCamera(int width, int height) throws CameraAccessException {
        CameraManager cameraManager = (CameraManager) getContext().getSystemService(Context.CAMERA_SERVICE);
        for (String cameraId: cameraManager.getCameraIdList()) {
            CameraCharacteristics cameraCharacteristics = cameraManager.getCameraCharacteristics(cameraId);
            if (cameraCharacteristics.get(CameraCharacteristics.LENS_FACING) == CameraCharacteristics.LENS_FACING_BACK) {
                StreamConfigurationMap map = cameraCharacteristics.get(CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP);
                int deviceOrientation = ((Activity)getContext()).getWindowManager().getDefaultDisplay().getRotation();
                int totalRotation = sensorToDeviceRotation(cameraCharacteristics, deviceOrientation);
                boolean swapRotation = totalRotation == 90 || totalRotation == 270;
                int rotatedWidth = width;
                int rotatedHeight = height;
                if (swapRotation) {
                    rotatedWidth = height;
                    rotatedHeight = width;
                }
                previewSize = chooseOptimalSize(map.getOutputSizes(SurfaceTexture.class), rotatedWidth, rotatedHeight);
                this.cameraId = cameraId;
                return;
            }
        }
    }

    private void connectCamera() throws CameraAccessException {
        CameraManager cameraManager = (CameraManager) getContext().getSystemService(Context.CAMERA_SERVICE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ContextCompat.checkSelfPermission(getContext(), Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
                cameraManager.openCamera(cameraId, cameraDeviceStateCallback, cameraBackgroundHandler);
            } else {
                ((Activity)getContext()).requestPermissions(new String[]{Manifest.permission.CAMERA}, REQUEST_CAMERA_PERMISSION_RESULT);
            }
        } else {
            cameraManager.openCamera(cameraId, cameraDeviceStateCallback, cameraBackgroundHandler);
        }
    }

    private void closeCamera() {
        if (cameraDev != null) {
            cameraDev.close();
            cameraDev = null;
        }
    }

    private void startBackgroundThread() {
        cameraBackgroundThread = new HandlerThread("GroakCamera");
        cameraBackgroundThread.start();
        cameraBackgroundHandler = new Handler(cameraBackgroundThread.getLooper());
    }

    private void stopBackgroundThread() throws InterruptedException {
        cameraBackgroundThread.quitSafely();
        cameraBackgroundThread.join();
        cameraBackgroundThread = null;
        cameraBackgroundHandler = null;
    }

    private static int sensorToDeviceRotation(CameraCharacteristics cameraCharacteristics, int deviceOrientation) {
        int sensorOrientation = cameraCharacteristics.get(CameraCharacteristics.SENSOR_ORIENTATION);
        deviceOrientation = ORIENTATIONS.get(deviceOrientation);
        return (sensorOrientation + deviceOrientation + 360) % 360;
    }

    private static Size chooseOptimalSize(Size[] choices, int width, int height) {
        List<Size> bigEnough = new ArrayList<>();
        for (Size option: choices) {
            if (option.getHeight() == option.getWidth() * height / width
                    && option.getWidth() >= width && option.getHeight() >= height) {
                bigEnough.add(option);
            }
        }
        if (bigEnough.size() > 0) {
            return Collections.min(bigEnough, new CompareSizeByArea());
        } else {
            return choices[0];
        }
    }
}
