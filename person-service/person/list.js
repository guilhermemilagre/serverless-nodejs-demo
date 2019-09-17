'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.list = (event, context, callback) => {

    // fetch all todos from the database
    dynamoDb.scan({
        TableName: process.env.DYNAMODB_TABLE,
    }, (error, result) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t fetch the person.',
            });
            return;
        }

        // create a response

        callback(null, {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        });
    });
};
