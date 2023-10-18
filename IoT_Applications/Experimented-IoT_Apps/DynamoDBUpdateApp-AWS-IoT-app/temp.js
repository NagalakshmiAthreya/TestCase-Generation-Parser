const awsIoT = require('aws-iot-device-sdk');
const crypto = require('crypto');
const endpointFile = require('/home/ec2-user/environment/endpoint.json');
const deviceName = 'temp_sensor';
const device = awsIoT.device({
   keyPath: 'private_temp.pem.key',
  certPath: 'certificate_temp.pem.crt',
    caPath: '/home/ec2-user/environment/root-CA.crt',
  clientId: deviceName,
      host: endpointFile.endpointAddress
});


function randomFloatBetween(minValue,maxValue){
    return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)),maxValue));
}


device.on('connect', function() {
    console.log('Connected to AWS IoT');
    publishData();
});

function publishData() {
    console.log('Sending temperature data to AWS IoT');
    device.publish("lab/temp_data", randomFloatBetween(0,120).toString());
    setTimeout(publishData, 10000);
}
