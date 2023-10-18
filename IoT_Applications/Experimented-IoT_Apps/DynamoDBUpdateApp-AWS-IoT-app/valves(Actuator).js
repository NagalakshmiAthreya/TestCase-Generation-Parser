const awsIoT = require('aws-iot-device-sdk');
const endpointFile = require('/home/ec2-user/environment/endpoint.json');
const heat_valve = 'heat_valve';
const cool_valve = 'cool_valve';
const pressureIn_valve = 'pressureIn_valve';
const pressureOut_valve = 'pressureOut_valve';

const initialState = {
    state: { 
        reported: { 
            valve_on: false
        }, 
        desired: null 
    }
};

function outputValveState(device, lights) {
    if (lights) {
        console.log(device + ' is on');
    } else {
        console.log(device + ' is off');
    }
}

function setDefaultState(device) {
    console.log('No '+ device + ' state found, setting state to defaults.');
    heatValve.update(device, initialState);
    outputValveState(initialState.state.reported.valve_on);
}

function isUndefined(value) {
    return typeof value === 'undefined' || value === null;
}

let initialGetClientToken_1;
let initialGetClientToken_2;
let initialGetClientToken_3;
let initialGetClientToken_4;


const heatValve = awsIoT.thingShadow({
   keyPath: 'private_heat_valve.pem.key',
  certPath: 'certificate_heat_valve.pem.crt',
    caPath: '/home/ec2-user/environment/root-CA.crt',
  clientId: heat_valve,
      host: endpointFile.endpointAddress
});
const coolValve = awsIoT.thingShadow({
   keyPath: 'private_cool_valve.pem.key',
  certPath: 'certificate_cool_valve.pem.crt',
    caPath: '/home/ec2-user/environment/root-CA.crt',
  clientId: cool_valve,
      host: endpointFile.endpointAddress
});
const pressureInValve = awsIoT.thingShadow({
   keyPath: 'private_pressureIn_valve.pem.key',
  certPath: 'certificate_pressureIn_valve.pem.crt',
    caPath: '/home/ec2-user/environment/root-CA.crt',
  clientId: pressureIn_valve,
      host: endpointFile.endpointAddress
});
const pressureOutValve = awsIoT.thingShadow({
   keyPath: 'private_pressureOut_valve.pem.key',
  certPath: 'certificate_pressureOut_valve.pem.crt',
    caPath: '/home/ec2-user/environment/root-CA.crt',
  clientId: pressureOut_valve,
      host: endpointFile.endpointAddress
});



heatValve.register(heat_valve, {}, function(err, failedTopics) {
    if (isUndefined(err) && isUndefined(failedTopics)) {
        console.log('The ' + heat_valve + ' has been registered.\r\nSending initial get to set the valve state.');
        initialGetClientToken_1 = heatValve.get(heat_valve);
    }
});
coolValve.register(cool_valve, {}, function(err, failedTopics) {
    if (isUndefined(err) && isUndefined(failedTopics)) {
        console.log('The ' + cool_valve + ' has been registered.\r\nSending initial get to set the valve state.');
        initialGetClientToken_2 = coolValve.get(cool_valve);
    }
});
pressureInValve.register(pressureIn_valve, {}, function(err, failedTopics) {
    if (isUndefined(err) && isUndefined(failedTopics)) {
        console.log('The ' + pressureIn_valve + ' has been registered.\r\nSending initial get to set the valve state.');
        initialGetClientToken_3 = pressureInValve.get(pressureIn_valve);
    }
});
pressureOutValve.register(pressureOut_valve, {}, function(err, failedTopics) {
    if (isUndefined(err) && isUndefined(failedTopics)) {
        console.log('The ' + pressureOut_valve + ' has been registered.\r\nSending initial get to set the valve state.');
        initialGetClientToken_4 = pressureOutValve.get(pressureOut_valve);
    }
});



heatValve.on('delta', function(thingName, stateObject) {
    if (!isUndefined(stateObject.state.valve_on)) {
        outputValveState(thingName, stateObject.state.valve_on);
    }
    console.log('Reporting my new state.');
    heatValve.update(thingName, { state: { reported: stateObject.state, desired: null } } );
});
coolValve.on('delta', function(thingName, stateObject) {
    if (!isUndefined(stateObject.state.valve_on)) {
        outputValveState(thingName, stateObject.state.valve_on);
    }
    console.log('Reporting my new state.');
    coolValve.update(thingName, { state: { reported: stateObject.state, desired: null } } );
});
pressureInValve.on('delta', function(thingName, stateObject) {
    if (!isUndefined(stateObject.state.valve_on)) {
        outputValveState(thingName, stateObject.state.valve_on);
    }
    console.log('Reporting my new state.');
    pressureInValve.update(thingName, { state: { reported: stateObject.state, desired: null } } );
});
pressureOutValve.on('delta', function(thingName, stateObject) {
    if (!isUndefined(stateObject.state.valve_on)) {
        outputValveState(thingName, stateObject.state.valve_on);
    }
    console.log('Reporting my new state.');
    pressureOutValve.update(thingName, { state: { reported: stateObject.state, desired: null } } );
});


heatValve.on('status', function(thingName, statusType, clientToken, stateObject) {
    if (initialGetClientToken_1 === clientToken && statusType === 'rejected') {
        setDefaultState(thingName);
    }
    if (initialGetClientToken_1 === clientToken && statusType === 'accepted') {
        console.log('Received the initial get data.');
        if (Object.keys(stateObject.state).length == 0) {
            setDefaultState(thingName);
        } 
        else if (stateObject.state.hasOwnProperty('delta')) {
            console.log('Delta found on initial get setting '+ thingName +' to that state and reporting.');
            if (!isUndefined(stateObject.state.delta.valve_on)) {
                outputValveState(thingName, stateObject.state.delta.valve_on);
            }
            heatValve.update(thingName, { state: { reported: stateObject.state.delta, desired: null } } );
            
        } else {
            if (stateObject.state.reported.hasOwnProperty('valve_on')) {
                console.log('Found a previously reported state, setting my ' + thingName +' to that');
                outputValveState(thingName, stateObject.state.reported.valve_on);
            } else {
                setDefaultState(thingName);
            }
        }
    }
});
coolValve.on('status', function(thingName, statusType, clientToken, stateObject) {
    if (initialGetClientToken_2 === clientToken && statusType === 'rejected') {
        setDefaultState(thingName);
    }
    if (initialGetClientToken_2 === clientToken && statusType === 'accepted') {
        console.log('Received the initial get data.');
        if (Object.keys(stateObject.state).length == 0) {
            setDefaultState(thingName);
        } 
        else if (stateObject.state.hasOwnProperty('delta')) {
            console.log('Delta found on initial get setting '+ thingName +' to that state and reporting.');
            if (!isUndefined(stateObject.state.delta.valve_on)) {
                outputValveState(thingName, stateObject.state.delta.valve_on);
            }
            coolValve.update(thingName, { state: { reported: stateObject.state.delta, desired: null } } );
            
        } else {
            if (stateObject.state.reported.hasOwnProperty('valve_on')) {
                console.log('Found a previously reported state, setting my ' + thingName +' to that');
                outputValveState(thingName, stateObject.state.reported.valve_on);
            } else {
                setDefaultState(thingName);
            }
        }
    }
});
pressureInValve.on('status', function(thingName, statusType, clientToken, stateObject) {
    if (initialGetClientToken_3 === clientToken && statusType === 'rejected') {
        setDefaultState(thingName);
    }
    if (initialGetClientToken_3 === clientToken && statusType === 'accepted') {
        console.log('Received the initial get data.');
        if (Object.keys(stateObject.state).length == 0) {
            setDefaultState(thingName);
        } 
        else if (stateObject.state.hasOwnProperty('delta')) {
            console.log('Delta found on initial get setting '+ thingName +' to that state and reporting.');
            if (!isUndefined(stateObject.state.delta.valve_on)) {
                outputValveState(thingName, stateObject.state.delta.valve_on);
            }
            pressureInValve.update(thingName, { state: { reported: stateObject.state.delta, desired: null } } );
            
        } else {
            if (stateObject.state.reported.hasOwnProperty('valve_on')) {
                console.log('Found a previously reported state, setting my ' + thingName +' to that');
                outputValveState(thingName, stateObject.state.reported.valve_on);
            } else {
                setDefaultState(thingName);
            }
        }
    }
});
pressureOutValve.on('status', function(thingName, statusType, clientToken, stateObject) {
    if (initialGetClientToken_4 === clientToken && statusType === 'rejected') {
        setDefaultState(thingName);
    }
    if (initialGetClientToken_4 === clientToken && statusType === 'accepted') {
        console.log('Received the initial get data.');
        if (Object.keys(stateObject.state).length == 0) {
            setDefaultState(thingName);
        } 
        else if (stateObject.state.hasOwnProperty('delta')) {
            console.log('Delta found on initial get setting '+ thingName +' to that state and reporting.');
            if (!isUndefined(stateObject.state.delta.valve_on)) {
                outputValveState(thingName, stateObject.state.delta.valve_on);
            }
            pressureOutValve.update(thingName, { state: { reported: stateObject.state.delta, desired: null } } );
            
        } else {
            if (stateObject.state.reported.hasOwnProperty('valve_on')) {
                console.log('Found a previously reported state, setting my ' + thingName +' to that');
                outputValveState(thingName, stateObject.state.reported.valve_on);
            } else {
                setDefaultState(thingName);
            }
        }
    }
});


heatValve.on('close', function() {
    console.log('The connection has been closed. Deregistering the Thing Shadow.');
      heatValve.unregister(heat_valve);
});
coolValve.on('close', function() {
    console.log('The connection has been closed. Deregistering the Thing Shadow.');
      coolValve.unregister(cool_valve);
});
pressureInValve.on('close', function() {
    console.log('The connection has been closed. Deregistering the Thing Shadow.');
      pressureInValve.unregister(pressureIn_valve);
});
pressureOutValve.on('close', function() {
    console.log('The connection has been closed. Deregistering the Thing Shadow.');
      pressureOutValve.unregister(pressureOut_valve);
});