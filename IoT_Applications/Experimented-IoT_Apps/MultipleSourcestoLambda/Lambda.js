exports.handler = async (event, context) => {
    try {
        // Check if the event is an S3 event
        if (event.Records && event.Records.length > 0) {
            // Handle S3 event
            for (const record of event.Records) {
                if (record.eventSource === 'aws:s3' && record.eventName === 'ObjectCreated') {
                    const bucket = record.s3.bucket.name;
                    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
                    console.log(`Received S3 event for object: ${key} in bucket: ${bucket}`);
                    
                    // Add your S3 data processing logic here
                    
                    // For example, you can read the object from S3 and perform operations on it
                }
            }
        }
        
        // Check if the event is an SNS event
        if (event.Records && event.Records.length === 1 && event.Records[0].EventSource === 'aws:sns') {
            // Handle SNS event
            const snsMessage = JSON.parse(event.Records[0].Sns.Message);
            console.log('Received SNS message:', snsMessage);
            
            // Add your SNS data processing logic here
            
            // For example, you can extract information from the SNS message and take appropriate actions
        }
        
        // You can include additional logic to process other types of events if needed
        
        return 'Successfully processed events';
    } catch (error) {
        console.error('Error processing events:', error);
        throw error;
    }
};
