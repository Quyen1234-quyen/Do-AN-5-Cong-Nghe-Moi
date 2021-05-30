

var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2"
});
AWS.config.accessKeyId="AKIAID7V3NGIR6Z7A6FQ";
AWS.config.secretAccessKey="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";

var dynamodb = new AWS.DynamoDB();

exports.DeleteTable=(table)=>{
    var params = {
        TableName : table
    };
    
    dynamodb.deleteTable(params, function(err, data) {
        if (err) {
            console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
        }
    });
}