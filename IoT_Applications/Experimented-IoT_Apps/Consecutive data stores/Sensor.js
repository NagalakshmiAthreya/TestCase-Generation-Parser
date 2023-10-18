const awsIot = require('aws-iot-device-sdk');
const path = require('path');

const device = awsIot.device({
  keyPath: path.join(__dirname, 'privateKey.pem.key'),
  certPath: path.join(__dirname, 'certificate.pem.crt'),
  caPath: path.join(__dirname, 'root-CA.crt'),
  clientId: 'my-sensor',
  host: 'YOUR_IOT_ENDPOINT',
});

device.on('connect', function() {
  console.log('Connected to AWS IoT');
  
  // Simulate sending temperature data
  setInterval(() => {
    const temperature = Math.random() * 10 + 20; // Simulated temperature value
    const payload = JSON.stringify({ temperature });
    device.publish('temperature_data', payload);
    console.log('Temperature data sent:', payload);
  }, 5000); // Send data every 5 seconds
});
