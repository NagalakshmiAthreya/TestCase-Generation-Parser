const aws = require('aws-sdk');
const db = new aws.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    // Log the received event data
    console.log('Received event:', JSON.stringify(event, null, 2));

    try {
        await db.put({
            TableName: "data",
            Item: {
                id: "pressure",
                value: event,
            }
        }).promise();
        console.log('Data inserted into DynamoDB successfully');
    } catch (err) {
        console.error('Error inserting data into DynamoDB:', err);
        return err;
    }
};
