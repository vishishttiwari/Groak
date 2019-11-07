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
    internal var restaurantFound: ((_ restaurant: Restaurant) -> ())?
    
    // Initialization of variables for camera
    private var captureSession = AVCaptureSession()
    private var defaultCamera: AVCaptureDevice?
    private var videoOutput = AVCaptureMetadataOutput()
    private var cameraPreviewLayer: AVCaptureVideoPreviewLayer?
    
    required init() {
        super.init(frame: .zero)
        
        self.frame.origin.x = 0
        self.frame.origin.y = 0
        self.frame.size.width = Catalog.screenSize.width
        self.frame.size.height = Catalog.screenSize.height
        
        setupDevice()
        setupInput()
        setupOutput()
        setupQRCodeCapture()
        setupPreviewLayer()
        startRunningCaptureSession()
    }
    
    // This method sets up the camera device
    private func setupDevice() {
        defaultCamera = AVCaptureDevice.default(for: .video)
    }
    
    // This method sets up the input format and device
    private func setupInput() {
        do {
            let captureDeviceInput = try AVCaptureDeviceInput(device: defaultCamera!)               // This
            captureSession.addInput(captureDeviceInput)                                             // If the camera be added as an input then it is added as input
        } catch {
            print(error)
        }
    }
    
    // This method sets up the output format and device
    private func setupOutput() {
        captureSession.addOutput(videoOutput)
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
    
    // This method starts the session of capturing frames from camera and showing it on screen
    private func startRunningCaptureSession() {
        captureSession.commitConfiguration()
        captureSession.startRunning()
        
        let focusFrame = CGRect.init(x: 0, y: 0, width: self.frame.width, height: self.frame.height/2)
        videoOutput.rectOfInterest = cameraPreviewLayer!.metadataOutputRectConverted(fromLayerRect: focusFrame)
    }
    
    // This sets up the qr code scanner
    func metadataOutput(_ output: AVCaptureMetadataOutput, didOutput metadataObjects: [AVMetadataObject], from connection: AVCaptureConnection) {
        if metadataObjects.count != 0 {
            if let object = metadataObjects[0] as? AVMetadataMachineReadableCodeObject {
                
                if object.type == .qr {
                    let fsTable = FirestoreAPICallsTables.init();
                    fsTable.fetchTableFirestoreAPI(tableId: object.stringValue ?? "")
                    fsTable.dataReceivedForFetchTable = { (_ table: Table?) -> () in
                        
                        if let table = table, table.success() {
                            let fsRestaurant = FirestoreAPICallsRestaurants.init();
                            fsRestaurant.fetchRestaurantFirestoreAPI(restaurantReference: table.restaurantReference)
                            fsRestaurant.dataReceivedForFetchRestaurant = { (_ restaurant: Restaurant?) -> () in
                                
                                if let restaurant = restaurant, restaurant.success() {
                                    self.restaurantFound?(restaurant)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
