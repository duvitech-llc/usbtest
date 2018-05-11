'use strict';

const delay = (duration) =>
  new Promise(resolve => setTimeout(resolve, duration));

var keypress = require('keypress');

var usb = require('usb');
var fs = require('fs');
var brun = true;


var six15IDs = {
    'vendorId': 0x2DC4,
    'productId': 0x0200
};

function sendToHud(ep, data){
    return new Promise(r => ep.transfer(data, function(error){        
        if(error != undefined){
            console.log("Device outEndpoint tx failed");
            r();
        }else{
            console.log('image sent');
            r();
        }
    }));

}

async function processFiles(ep, callback){    
    const files = fs.readdirSync('./images/');
    let count = 0;
    while(brun){
        let file = files[count];

        console.log('Process File: ./images/' + file);
        const data = fs.readFileSync('./images/'+file);
        console.log('Sent Image length: ' + data.length);
        await sendToHud(ep, data);
        await delay(100);

        count++;
        if(count >= files.length)
            count = 0;

    }

    callback();
}

console.log('start');

var myDarwin = usb.findByIds(six15IDs.vendorId, six15IDs.productId);
if(myDarwin !== undefined) {
    
    console.log("Found SIX-15 Display Device");
    
    myDarwin.open();
    console.log("Device Opened");
    console.log("Claiming Display interface");
    myDarwin.interfaces[6].claim();
    var endpoints = myDarwin.interfaces[6].endpoints;
    var outEndpoint = endpoints[0];        
    myDarwin.transferType  = usb.LIBUSB_TRANSFER_TYPE_BULK;

    processFiles(outEndpoint, function(){
        console.log('end');
        
        myDarwin.interfaces[6].release(function(data){
            console.log("released");
            myDarwin.close();
        }); 

    });
    

} else {
    console.log('HUD Not Found');
}


