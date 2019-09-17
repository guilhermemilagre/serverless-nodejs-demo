'use strict';

const AWS = require('aws-sdk');

const SES = new AWS.SES();

exports.receiver = (event, context, callback) => {

  console.log('event: ', JSON.stringify(event));

  var body = event.Records[0].body;

  const person = JSON.parse(body);

  const to = person.email;

  const from = process.env.FROM_EMAIL;

  const sesParams = {
    Source: from,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
          <!DOCTYPE html>
          <html>
            <head></head>
            <body><h1>Olá ${person.name}, Seu pincode é ${Math.floor(Math.random() * (999999 - 100000)) + 100000}</h1></body>
          </html>
        `,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: process.env.SUBJECT_EMAIL,
      },
    },
  };

  console.log("Ses params: " + JSON.stringify(sesParams));

  const sendPromise = SES.sendEmail(sesParams).promise();

  // Handle promise's fulfilled/rejected states
  sendPromise.then(
    function (data) {
      console.log("SQS event processed: " + JSON.stringify(data));
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: 'SQS event processed.',
          input: event,
        }),
      });
    }).catch(
      function (err) {
        console.log("SQS event unprocessed: " + JSON.stringify(err));
        callback(err, {
          statusCode: 500,
          body: JSON.stringify({
            message: 'SQS event unprocessed.',
            input: event,
          }),
        });
      });
};
