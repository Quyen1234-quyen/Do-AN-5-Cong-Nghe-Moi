var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-west-2"
});

AWS.config.accessKeyId = "AKIAID7V3NGIR6Z7A6FQ";
AWS.config.secretAccessKey = "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";
var docClient = new AWS.DynamoDB.DocumentClient();
var User=require("./loadData/loadUser");
var Product=require("./loadData/loadProduct");
var ProductCategory=require("./loadData/loadProdCategory");
var Billinfo=require("./loadData/loadBillinfo");
var Bill=require("./loadData/loadBill");
// load Dữ liệu
// User.LoadUser(docClient ,fs);
// ProductCategory.LoadProductCategory(docClient,fs );
Product.LoadProduct(docClient,fs );
// Billinfo.LoadBillinfo(docClient,fs);
// Bill.LoadBill(docClient,fs);

