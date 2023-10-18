const assert = require('assert');
const sinon = require('sinon');
const AWS = require('aws-sdk-mock');
const sensor = require('./sensor'); // Replace with your sensor module
const lambda1 = require('./lambda1');
const lambda2 = require('./lambda2');
const lambda3 = require('./lambda3');

describe('End-to-End Test', () => {
  before(() => {
    // Mock external services
    AWS.mock('IotData', 'publish', (params, callback) => {
      callback(null, 'Success');
    });
    // Add more mocks as needed for other AWS services
  });

  after(() => {
    // Restore AWS services
    AWS.restore('IotData');
    // Restore other mocks as needed
  });

  it('should simulate the end-to-end flow', async () => {
    // Simulate sensor data
    const sensorData = { uv_visible: 800 }; // Adjust based on your sensor data
    
    // Simulate the sensor sending data
    const sensorSpy = sinon.spy(sensor, 'sendData');
    sensor.sendData(sensorData);
    assert.ok(sensorSpy.calledOnce);

    // Verify the behavior of lambda1
    const result1 = await lambda1.handler(sensorData);
    assert.strictEqual(result1, 'Success'); // Adjust based on lambda1's behavior
    
    // Verify the behavior of lambda2
    const result2 = await lambda2.handler({}); // Provide appropriate event data
    assert.strictEqual(result2, 'Success'); // Adjust based on lambda2's behavior
    
    // Verify the behavior of lambda3
    const result3 = await lambda3.handler({}); // Provide appropriate event data
    assert.strictEqual(result3, 'Success'); // Adjust based on lambda3's behavior
  });
});
