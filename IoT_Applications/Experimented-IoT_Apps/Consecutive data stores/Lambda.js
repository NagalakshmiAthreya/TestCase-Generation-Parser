const AWS = require('aws-sdk');
const sns = new AWS.SNS();

exports.handler = async (event, context) => {
    try {
        // Process DynamoDB stream records
        for (const record of event.Records) {
            if (record.eventName === 'INSERT' || record.eventName === 'MODIFY') {
                // Extract the temperature data from the DynamoDB record
                const temperatureData = JSON.parse(record.dynamodb.NewImage.data.S);

                // Perform data processing as needed
                // For example, you can save it to a database, analyze it, or send notifications
                
                // Send an SNS message with the temperature data
                const snsMessage = `Temperature data received: ${JSON.stringify(temperatureData)}`;
                await publishSNSMessage(snsMessage);
            }
        }

        return 'Processed DynamoDB stream events';
    } catch (error) {
        console.error('Error processing DynamoDB stream events:', error);
        throw error;
    }
};

// Helper function to publish an SNS message
const publishSNSMessage = async (message) => {
    const params = {
        Message: message,
        TopicArn: 'arn:aws:sns:YOUR_REGION:YOUR_ACCOUNT_ID:YOUR_SNS_TOPIC_ARN'
    };
    
    try {
        await sns.publish(params).promise();
        console.log('SNS message sent:', message);
    } catch (error) {
        console.error('Error sending SNS message:', error);
        throw error;
    }
};
