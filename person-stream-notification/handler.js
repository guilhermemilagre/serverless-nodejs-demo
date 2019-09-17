'use strict';

const AWS = require('aws-sdk');

const SQS = new AWS.SQS();

exports.record = (event, context, callback) => {

  event.Records.forEach((record) => {

    const person = new AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage);

    const message = JSON.stringify(person);

    SQS.sendMessage({
      MessageBody: message,
      QueueUrl: process.env.QUEUE_URL_EMAIL_NOTIFICATION,
      DelaySeconds: 0
    }, function (err, data) {

      if (err) {
        callback(err, `Unsuccessfully processed ${event.Records.length} records.`);
      }

      console.log(`Successfully processed and send queue to message: ` + message);

      callback(null, `Successfully processed ${event.Records.length} records.`);

    });
  });


};
