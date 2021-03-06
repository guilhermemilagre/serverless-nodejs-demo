'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const { name, checked } = JSON.parse(event.body);

    // validation
    if (typeof name !== 'string' || typeof checked !== 'boolean') {
        console.error('Validation Failed');
        callback(null, {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t update the name item.',
        });
        return;
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: event.pathParameters.id,
        },
        ExpressionAttributeNames: {
            '#person_name': 'name',
        },
        ExpressionAttributeValues: {
            ':name': name,
            ':checked': checked,
            ':updatedAt': timestamp,
        },
        UpdateExpression: 'SET #person_name = :name, checked = :checked, updatedAt = :updatedAt',
        ReturnValues: 'ALL_NEW',
    };

    // update the name in the database
    dynamoDb.update(params, (error, result) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t fetch the name item.',
            });
            return;
        }

        // create a response
        callback(null, {
            statusCode: 200,
            body: JSON.stringify(result.Attributes),
        });
    });
};