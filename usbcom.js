'use strict';

var usb = require('usb');
var sr = require('seed-random');

var six15IDs = {
    'vendorId': 1155,
    'productId': 22336
};

// console.log(usb.getDeviceList());
var myDarwin = usb.findByIds(six15IDs.vendorId, six15IDs.productId);
if(myDarwin !== undefined) {
    
    console.log("Found ST Serialport Device");
    var finished = false;    

    myDarwin.open();
    console.log("Device Opened");
    console.log("Claiming Display interface");
    myDarwin.interfaces[0].claim();
    var endpoints = myDarwin.interfaces[0].endpoints;
    var outEndpoint = endpoints[0];

}else{
    console.log("Could Not Find Device");
}
