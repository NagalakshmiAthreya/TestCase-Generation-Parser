Steps:
IoT Sensor:Generates simulated temperature data and sends it to AWS IoT Core.

AWS IoT Core:Receives the temperature data and forwards it to an S3 bucket using an IoT Core rule.

IoT Core Rule for S3:An IoT Core rule listens for messages on the "temperature_data" topic.
The rule triggers an action to send the message to an S3 bucket.

S3 Bucket:The temperature data is stored as an object in the S3 bucket.

Amazon EventBridge Rule for DynamoDB:Configure an EventBridge rule that listens for S3 events,
 when new objects are created in the S3 bucket.

The rule triggers an action to insert the data into an Amazon DynamoDB table.

DynamoDB Insertion::The EventBridge rule action triggers the insertion of the temperature data 
into the specified DynamoDB table.

The ESM configuration specifies that it should listen to the DynamoDB stream associated with your DynamoDB table 
and invoke the Lambda function ("FunctionConfig.FunctionArn") when new records are inserted or 
updated in the DynamoDB table.

In this Lambda function:
It processes DynamoDB stream records, specifically handling INSERT and MODIFY events.
It extracts the temperature data from the DynamoDB record.
You can customize the data processing logic based on your requirements.
It sends an SNS message with the temperature data to the specified SNS topic using the publishSNSMessage helper function.