var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2"
});
AWS.config.accessKeyId = "AKIAID7V3NGIR6Z7A6FQ";
AWS.config.secretAccessKey = "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";

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "Billinfo";

var idBill = "B1";
var idprod = "P4";
var quantity = "1";

var params = {
    TableName: table,
    Item: {
        "IdBill": idBill,
        "Idprod": idprod,
        "quantity": quantity
    }
};

console.log("Adding a new item...");
docClient.put(params, function (err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
    }
});