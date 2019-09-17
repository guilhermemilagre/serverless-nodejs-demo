'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {

    const timestamp = new Date().getTime();

    const { name, email } = JSON.parse(event.body);

    if (typeof name !== 'string' && typeof email !== 'string') {
        console.error('Validation Failed');
        callback(null, {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t create the person item.',
        });
        return;
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            id: uuid.v1(),
            name: name,
            email: email,
            checked: false,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    };

    // write the todo to the database
    dynamoDb.put(params, (error) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t create the person.',
            });
            return;
        }

        // create a response
        callback(null, {
            statusCode: 201,
            body: JSON.stringify(params.Item),
        });
    });
};