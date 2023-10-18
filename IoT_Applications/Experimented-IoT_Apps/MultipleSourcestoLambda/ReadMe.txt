Sensor Data Generation:
The IoT sensor generates data (e.g., temperature readings) and sends it to AWS IoT Core. 
You can use the code provided in a previous response to simulate the sensor data.

AWS IoT Core:
AWS IoT Core receives data from the sensor and routes it to an S3 bucket using an IoT Core rule.

S3 Bucket:
The temperature data is stored as objects in an S3 bucket when IoT Core rule triggers.

Amazon SNS:
Additionally, an SNS topic is configured to listen to the S3 bucket events. 
Whenever a new object is created in the S3 bucket (e.g., new temperature data), 
an SNS message is published to an SNS topic.

Lambda Function:
A Lambda function is configured to be triggered by both S3 and SNS events.
The Lambda function is responsible for handling events from both sources.

S3 Event Trigger:
When a new object is created in the S3 bucket, it triggers an S3 event that invokes the Lambda function. 
The Lambda function receives information about the S3 event, including details about the created object.

SNS Event Trigger:
Simultaneously, when the SNS topic publishes a message, 
it triggers an SNS event that also invokes the same Lambda function. 
The Lambda function receives information about the SNS message.

Lambda Processing:
Inside the Lambda function, you can implement logic to process data from both sources.
For S3 events, the Lambda function can read the temperature data from the created object in the S3 bucket.
For SNS events, the Lambda function can extract information from the SNS message, 
including details about the event that occurred in the S3 bucket.