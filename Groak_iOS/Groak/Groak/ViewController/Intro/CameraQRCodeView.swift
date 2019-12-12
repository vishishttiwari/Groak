//
//  CameraQRCodeView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This class sets up the camera qr code view

import AVFoundation
import UIKit

internal class CameraQRCodeView: UIView, AVCaptureMetadataOutputObjectsDelegate {
    
    // Optional Closures
    internal var restaurantFound: ((_ table: Table, _ restaurant: Restaurant) -> ())?
    
    // Initialization of variables for camera
    private var captureSession = AVCaptureSession()
    private var defaultCamera: AVCaptureDevice?
    private var videoOutput = AVCaptureMetadataOutput()
    private var cameraPreviewLayer: AVCaptureVideoPreviewLayer?
    
    private var qrCodeProcessing: Bool = false
    private let fsTable = FirestoreAPICallsTables.init();
    private let fsRestaurant = FirestoreAPICallsRestaurants.init();
    
    required init() {
        super.init(frame: .zero)
        
        self.frame.origin.x = 0
        self.frame.origin.y = 0
        self.frame.size.width = DimensionsCatalog.screenSize.width
        self.frame.size.height = DimensionsCatalog.screenSize.height
        
        setupDevice()
        setupInput()
        setupOutput()
        setupPreviewLayer()
        setupQRCodeCapture()
        startRunningCaptureSession()
    }
    
    // This method sets up the camera device
    private func setupDevice() {
        defaultCamera = AVCaptureDevice.default(for: .video)
    }
    
    // This method sets up the input format and device
    private func setupInput() {
        do {
            let captureDeviceInput = try AVCaptureDeviceInput(device: defaultCamera!)               
            captureSession.addInput(captureDeviceInput)                                             // If the camera be added as an input then it is added as input
        } catch let error as NSError {
            print(error)
        }
    }
    
    // This method makes sure that only those frames are captured that have the type QR Code in them
    private func setupQRCodeCapture() {
        videoOutput.setMetadataObjectsDelegate(self, queue: DispatchQueue.main)
        videoOutput.metadataObjectTypes = [.qr]
    }
    
    // This method sets up the preview layer on the view controller to show the images
    private func setupPreviewLayer() {
        cameraPreviewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
        cameraPreviewLayer?.videoGravity = AVLayerVideoGravity.resizeAspectFill
        cameraPreviewLayer?.connection?.videoOrientation = AVCaptureVideoOrientation.portrait   // Only Potrait is aloud
        cameraPreviewLayer?.frame = self.frame                                                  // Set the size of the video display
        
        self.layer.addSublayer(cameraPreviewLayer!)                                             // Show video on the viewController
    }
    
    // This method sets up the output format and device
    private func setupOutput() {
        captureSession.addOutput(videoOutput)
    }
    
    private func startRunningCaptureSession() {
        captureSession.commitConfiguration()
    }
    
    // This method starts the session of capturing frames from camera and showing it on screen.
    // This method is called when a close graok restaurant is found
    func startScanningForQR() {
        captureSession.startRunning()
        
        let focusFrame = CGRect.init(x: 0, y: 0, width: self.frame.width, height: DimensionsCatalog.bottomSheetHeight)
        videoOutput.rectOfInterest = cameraPreviewLayer!.metadataOutputRectConverted(fromLayerRect: focusFrame)
    }
    
    // This method stop capturing frames. Its called when a restaurant is found which is same as the closest groak restaurant
    func stopScanningForQR() {
        captureSession.stopRunning()
    }
    
    // This method is whenever a frame is received
    func metadataOutput(_ output: AVCaptureMetadataOutput, didOutput metadataObjects: [AVMetadataObject], from connection: AVCaptureConnection) {
        
        // If the object found is qr and no qr is being processed right now then this is called. It fetches the table
        // Processing is used to make sure that multple requests to the database is not made. Once a qr code is being processed,
        // a different qr code will not be processed until the result of first one is received
        if metadataObjects.count != 0, !qrCodeProcessing, let object = metadataObjects[0] as?
            AVMetadataMachineReadableCodeObject, object.type == .qr {
            qrCodeProcessing = true
            fsTable.fetchTableFirestoreAPI(tableId: object.stringValue ?? "")
            fsTable.dataReceivedForFetchTable = { (_ table: Table?) -> () in
                
                // If a valid table is found then the restaurant to which that table belongs is found
                if let table = table, let restaurantReference = table.restaurantReference, table.success() {
                    self.fsRestaurant.fetchRestaurantFirestoreAPI(restaurantReference: restaurantReference)
                    self.fsRestaurant.dataReceivedForFetchRestaurant = { (_ restaurant: Restaurant?) -> () in
                        
                        // Once a valid restaurant is found then return that restaurant
                        if let restaurant = restaurant, restaurant.success() {
                            let generator = UIImpactFeedbackGenerator(style: .heavy)
                            generator.impactOccurred()
                            self.restaurantFound?(table, restaurant)
                        }
                        self.qrCodeProcessing = false;
                    }
                } else {
                    self.qrCodeProcessing = false
                }
            }
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
