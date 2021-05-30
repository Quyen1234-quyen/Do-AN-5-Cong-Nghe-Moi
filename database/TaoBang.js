var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2"
});
AWS.config.accessKeyId = "AKIAID7V3NGIR6Z7A6FQ";
AWS.config.secretAccessKey = "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";

var dynamodb = new AWS.DynamoDB();

var User=require("./taoBang/User");
var Product=require("./taoBang/Product");
var ProductCategory=require("./taoBang/ProductCategory");
var Billinfo=require("./taoBang/Billinfo");
var Bill=require("./taoBang/Bill");

// User.User(dynamodb);
Product.Product(dynamodb);
// ProductCategory.ProductCategory(dynamodb);
// Billinfo.Billinfo(dynamodb);
// Bill.Bill(dynamodb);