'use strict';

var usb = require('usb');
var sr = require('seed-random');
var fs = require('fs');

function random_buffer(length, seed){
    
	length = Math.max(1, length<<0);

	var rand = seed == null ? sr() : sr(seed),
		buf = new Buffer(length),
		i = 0;

	for (; i < length; ++i)
		buf[i] = (rand() * 0xFF)<<0;

    return buf;
    
};

var six15IDs = {
    'vendorId': 1155,
    'productId': 22336
};

var data = fs.readFileSync('./images/13 SPEEDOMETER_THUNDER.jpg');

// console.log(usb.getDeviceList());
var myDarwin = usb.findByIds(six15IDs.vendorId, six15IDs.productId);
if(myDarwin !== undefined) {
    
    console.log("Found SIX-15 Display Device");
    // var data = random_buffer(1024, 1002);
    var finished = false;

    myDarwin.open();
    console.log("Device Opened");
    console.log("Claiming Display interface");
    myDarwin.interfaces[6].claim();
    var endpoints = myDarwin.interfaces[6].endpoints;
    var outEndpoint = endpoints[0];

    console.log("Send Packet");
    
    myDarwin.transferType  = usb.LIBUSB_TRANSFER_TYPE_BULK;
    
    outEndpoint.transfer(data, function(error){        
        if(error != undefined){
            console.log("Device outEndpoint tx failed");
        }else{
            console.log("Packet sent");
        }

        myDarwin.interfaces[6].release(function(data){
            console.log("released");
            myDarwin.close();
        }); 
        console.log("Device Closed");
    });


}else{
    console.log("Could Not Find Device");
}
