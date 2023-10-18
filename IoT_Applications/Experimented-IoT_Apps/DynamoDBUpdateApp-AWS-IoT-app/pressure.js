const awsIoT = require('aws-iot-device-sdk');
const crypto = require('crypto');
const endpointFile = require('/home/ec2-user/environment/endpoint.json');
const deviceName = 'pressure_sensor';
const device = awsIoT.device({
   keyPath: 'private_pressure.pem.key',
  certPath: 'certificate_pressure.pem.crt',
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
    console.log('Sending pressure data to AWS IoT');
    device.publish("lab/pressure_data", randomFloatBetween(0.1,10.1).toString());
    setTimeout(publishData, 10000);
}
