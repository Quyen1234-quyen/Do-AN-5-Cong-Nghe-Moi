var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2"
});
AWS.config.accessKeyId = "AKIAID7V3NGIR6Z7A6FQ";
AWS.config.secretAccessKey = "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";
var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Querying for ProductCategory");

var params = {
    TableName: "Billinfo",
    ProjectionExpression: "#yr,Idprod,quantity",
    FilterExpression: "#yr =:yyyy ",
    ExpressionAttributeNames: {
        "#yr": "IdBill",
    },
    ExpressionAttributeValues: {
        ":yyyy":"B1"
    }
};
docClient.scan(params, onScan);
function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Tim thanh cong : so luong :",data.Items.length);
        console.log(data);
    }
}