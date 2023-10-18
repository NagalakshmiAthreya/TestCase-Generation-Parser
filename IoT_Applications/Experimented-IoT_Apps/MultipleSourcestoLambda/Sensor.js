const awsIot = require('aws-iot-device-sdk');
const path = require('path');

const device = awsIot.device({
  keyPath: path.join(__dirname, 'device-privateKey.pem.key'),
  certPath: path.join(__dirname, 'device-certificate.pem.crt'),
  caPath: path.join(__dirname, 'root-CA.crt'),
  clientId: 'device1', // Change the client ID for each device
  host: 'YOUR_IOT_ENDPOINT', // Replace with your AWS IoT Core endpoint
});

// Simulate sending temperature data
const simulateTemperatureData = () => {
  setInterval(() => {
    const temperature = Math.random() * 10 + 20; // Simulated temperature value
    const payload = JSON.stringify({ deviceId: 'device1', temperature });
    device.publish('temperature_data', payload);
    console.log('Temperature data sent:', payload);
  }, 5000); // Send data every 5 seconds
};

device.on('connect', function () {
  console.log('Device connected to AWS IoT');
  simulateTemperatureData();
});
