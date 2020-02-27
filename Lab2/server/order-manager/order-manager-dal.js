// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

'use strict';

const logManager = require('/opt/nodejs/log-manager.js');

const helper = require('/opt/nodejs/helper.js');
const doc = require('dynamodb-doc');
const dynamodb = new doc.DynamoDB();

const tableName = "Order";
const tableDefinition = {
    AttributeDefinitions: [ 
    {
      AttributeName: "OrderId", 
      AttributeType: "S"
    } ], 
    KeySchema: [ 
    {
      AttributeName: "OrderId", 
      KeyType: "HASH"
    } ], 
    ProvisionedThroughput: {
     ReadCapacityUnits: 5, 
     WriteCapacityUnits: 5
    }, 
    TableName: tableName
};

// Get an order from DynamoDB
module.exports.getOrder = function(event, callback) {
    logManager.log(event, "OrderManager", { "Message": "DAL GetOrder() called.", "OrderId" : event.pathParameters.resourceId});

    var params = {
        "TableName": tableName,
        "Key": {
            OrderId: event.pathParameters.resourceId
        }
    };

    dynamodb.getItem(params, (err, data) => {
        var response;
        if (err)
            response = createResponse(500, err);
        else
            response = createResponse(200, data.Item ? data.Item.doc : null);

        callback(response);
    });    
};

// Add or update an order to DynamoDB 
module.exports.updateOrder = (event, callback) => {
    logManager.log(event, "OrderManager", {"Message": "DAL UpdateOrder() called.", "OrderId" : event.pathParameters.resourceId});

    helper.createTable(tableDefinition, function() {
        var item = {
            "OrderId": event.pathParameters.resourceId,
            "doc": event.body
        };

        var params = {
            "TableName": tableName,
            "Item": item
        };

        dynamodb.putItem(params, (err) => {
            var response;
            if (err)
                response = createResponse(500, err);
            else
                response = createResponse(200, null);
            
            callback(response);
        });        
    });
};

// delete an order from DynamoDB 
module.exports.deleteOrder = (event, callback) => {
    logManager.log(event, "OrderManager", {"Message": "DAL deleteOrder() called.", "OrderId" : event.pathParameters.resourceId});

    var params = {
        "TableName": tableName,
        "Key": {
            "OrderId": event.pathParameters.resourceId
        }
    };

    dynamodb.deleteItem(params, (err) => {
        var response;
        if (err)
            response = createResponse(500, err);
        else
            response = createResponse(200, null);

        callback(response);
    });
};

const createResponse = (statusCode, body) => {
    return {
        "statusCode": statusCode,
        "body": body || ""
    }
};