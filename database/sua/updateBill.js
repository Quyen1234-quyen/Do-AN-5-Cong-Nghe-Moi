var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2"
});
AWS.config.accessKeyId = "AKIAID7V3NGIR6Z7A6FQ";
AWS.config.secretAccessKey = "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";

var docClient = new AWS.DynamoDB.DocumentClient();
var params = {
    TableName: "Bill",
    Key: {
        "IdBill": "B1",
        "IdUser": "Quyen"
    },
    UpdateExpression: "set address = :a,phoneNumber = :b,dateBuy = :c,trangthai=:d",
    ExpressionAttributeValues: {
        ":a": "anh",
        ":b": "em",
        ":c": "ta",
        ":d":"1"

    },
    ReturnValues: "UPDATED_NEW"
};
console.log("Updating the item...");

docClient.update(params, function (err, data) {
    console.log("bat dau update");
    if (err) {
        console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Updata Thanh Cong :", JSON.stringify(data, null, 2));
    }
});