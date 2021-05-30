var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2"
});
AWS.config.accessKeyId = "AKIAID7V3NGIR6Z7A6FQ";
AWS.config.secretAccessKey = "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";

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "Bill";

var IdBill = "B5";
var IdUser = "Huong";
var address = "Com Chien Trung";
var phoneNumber= "20000";
var dateBuy = "10000";

var params = {
    TableName: table,
    Item: {
        "IdBill": IdBill,
        "IdUser": IdUser,
        "email": "lvq@gamil.com",
        "address": address,
        "phoneNumber": phoneNumber,
        "dateBuy": dateBuy,
        "trangthai":"1"
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