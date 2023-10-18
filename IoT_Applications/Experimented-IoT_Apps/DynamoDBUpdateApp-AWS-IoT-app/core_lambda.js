const aws = require('aws-sdk');
const db = new aws.DynamoDB.DocumentClient();
var sns = new aws.SNS();

const params = {
  TableName: 'data',
};

async function listItems() {
  try {
    const data = await db.scan(params).promise();
    return data;
  } catch (err) {
    console.error('Error in listItems:', err);
    return err;
  }
}

exports.handler = async (event) => {
  try {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const data = await listItems();
    var table = {};
    for (var i = 0; i < 6; i++) {
      if (data.Items[i].hasOwnProperty('valve_on')) {
        table[data.Items[i].id] = data.Items[i].valve_on;
      } else {
        table[data.Items[i].id] = data.Items[i].value;
      }
    }
    console.log('Table:', table);

    check_and_act(table);
  } catch (err) {
    console.error('Error in handler:', err);
    return { error: err };
  }
};

function check_and_act(table) {
  check_and_act_for_temperature(table);
  check_and_act_for_pressure(table);
}

function check_and_act_for_temperature(table) {
  if (!isTemperatureGreaterThanMax(table.temperature) && !isTemperatureLessThanMin(table.temperature)) {
    console.log('Temperature within limits. No action required.');
    return;
  }

  if (isTemperatureGreaterThanMax(table.temperature) && !(table.cool_valve)) {
    console.log('Temperature too high. Turning on cool valve.');
    turnOn('cool_valve');
    if (table.heat_valve) {
      console.log('Turning off heat valve.');
      turnOff('heat_valve');
    }
  } else if (isTemperatureGreaterThanMax((table.temperature)) && table.cool_valve) {
    console.log('Temperature too high. Sending SNS notification.');
    var message = "Check for maintenance!! Temperature is high, even when cool valve is on " + table.temperature + " " + table.cool_valve;
    sendSNS(message);
  }

  if (isTemperatureLessThanMin(table.temperature) && !(table.heat_valve)) {
    console.log('Temperature too low. Turning on heat valve.');
    turnOn('heat_valve');
    if (table.cool_valve) {
      console.log('Turning off cool valve.');
      turnOff('cool_valve');
    }
  } else if (isTemperatureLessThanMin(table.temperature) && table.heat_valve) {
    console.log('Temperature too low. Sending SNS notification.');
    var message = "Check for maintenance!! Temperature is low, even when heat valve is on " + table.temperature + " " + table.heat_valve;
    sendSNS(message);
  }
}

function check_and_act_for_pressure(table) {
  if (!isPressureGreaterThanMax(table.pressure) && !isPressureLessThanMin(table.pressure)) {
    console.log('Pressure within limits. No action required.');
    return;
  }

  if (isPressureGreaterThanMax(table.pressure) && !(table.pressureOut_valve)) {
    console.log('Pressure too high. Turning on pressureOut_valve.');
    turnOn('pressureOut_valve');
    if (table.pressureIn_valve) {
      console.log('Turning off pressureIn_valve.');
      turnOff('pressureIn_valve');
    }
  } else if (isPressureGreaterThanMax((table.pressure)) && table.pressureOut_valve) {
    console.log('Pressure too high. Sending SNS notification.');
    var message = "Check for maintenance!! Pressure is high, even when pressureOut_valve is on " + table.pressure + " " + table.pressureOut_valve;
    sendSNS(message);
  }

  if (isPressureLessThanMin(table.pressure) && !(table.pressureIn_valve)) {
    console.log('Pressure too low. Turning on pressureIn_valve.');
    turnOn('pressureIn_valve');
    if (table.pressureOut_valve) {
      console.log('Turning off pressureOut_valve.');
      turnOff('pressureOut_valve');
    }
  } else if (isPressureLessThanMin(table.pressure) && table.pressureIn_valve) {
    console.log('Pressure too low. Sending SNS notification.');
    var message = "Check for maintenance!! Pressure is low, even when pressureIn_valve is on " + table.pressure + " " + table.pressureIn_valve;
    sendSNS(message);
  }
}

function isTemperatureGreaterThanMax(temp) {
  var max = 95;
  if (temp > max) {
    return true;
  }
  return false;
}

function isTemperatureLessThanMin(temp) {
  var min = 15;
  if (temp < min) {
    return true;
  }
  return false;
}

function isPressureGreaterThanMax(temp) {
  var max = 8.1;
  if (temp > max) {
    return true;
  }
  return false;
}

function isPressureLessThanMin(temp) {
  var min = 2.1;
  if (temp < min) {
    return true;
  }
  return false;
}

async function turnOn(deviceName) {
  var iotdata = new aws.IotData({ endpoint: 'a38hwbnfb1numt-ats.iot.us-west-2.amazonaws.com' });
  await db.put({
    TableName: "data",
    Item: {
      id: deviceName,
      valve_on: true,
    }
  }).promise();
  console.log('Turned on:', deviceName);
  var topicName = '$aws/things/' + deviceName + '/shadow/update';
  var dataToBeSent = {
    "state": {
      "desired": {
        "valve_on": true
      }
    }
  };
  var content = {
    topic: topicName,
    payload: JSON.stringify(dataToBeSent),
    qos: 1
  };
  await iotdata.publish(content, function (err, data) {
    if (err) {
      console.error('Error =>', JSON.stringify(err));
    } else {
      console.log('Success');
    }
  }).promise();
}

async function turnOff(deviceName) {
  var iotdata = new aws.IotData({ endpoint: 'a38hwbnfb1numt-ats.iot.us-west-2.amazonaws.com' });
  await db.put({
    TableName: "data",
    Item: {
      id: deviceName,
      valve_on: false,
    }
  }).promise();
  console.log('Turned off:', deviceName);
  var topicName = '$aws/things/' + deviceName + '/shadow/update';
  var dataToBeSent = {
    "state": {
      "desired": {
        "valve_on": false
      }
    }
  };
  var content = {
    topic: topicName,
    payload: JSON.stringify(dataToBeSent),
    qos: 1
  };
  await iotdata.publish(content, function (err, data) {
    if (err) {
      console.error('Error =>', JSON.stringify(err));
    } else {
      console.log('Success');
    }
  }).promise();
}

function sendSNS(message) {
  var payload = {
    Message: message,
    Subject: 'IIoT Notification',
    TopicArn: 'arn:aws:sns:us-west-2:209593679102:IIoT_Topic',
  };
  sns.publish(payload).promise();
  console.log('SNS Message Sent:', message);
}
