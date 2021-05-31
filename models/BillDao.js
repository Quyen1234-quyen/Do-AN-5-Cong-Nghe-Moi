var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-west-2"
});

AWS.config.accessKeyId = "";
AWS.config.secretAccessKey = "";

var docClient = new AWS.DynamoDB.DocumentClient();

//Xử lý phần Bill của khách hàng

//Lấy tất cả các Bill của Khách hàng
exports.getAllBill = (callback) => {
    var params = {
        TableName: "Bill",
        ProjectionExpression: "#yr,IdBill,address,phoneNumber,dateBuy,trangthai,email,tinhtrang",
        FilterExpression: "#yr between :start_yr and :end_yr ",
        ExpressionAttributeNames: {
            "#yr": "IdUser",
        },
        ExpressionAttributeValues: {
            ":start_yr": "A",
            ":end_yr":"Z"
        }
    };
    docClient.scan(params, onScan);
    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            callback(data);
        }
    }
}
//Láy Bill theo id
exports.getBillByiD = (id, callback) => {
    var params = {
        TableName: "Bill",
        ProjectionExpression: "#yr,IdUser,address,phoneNumber,dateBuy,email,trangthai,tinhtrang",
        FilterExpression: "#yr =:yyyy ",
        ExpressionAttributeNames: {
            "#yr": "IdBill",
        },
        ExpressionAttributeValues: {
            ":yyyy":id
        }
    };
    docClient.scan(params, onScan);
    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Tim thanh cong : so luong :",data.Items.length);
            callback(data);
        }
    }
}
//Thêm Bill cho khách hàng
exports.ThemBill = ( IdUser, address, phoneNumber,dateBuy,email,callback) => {

    var params = {
        TableName:"Bill",
        Item: {
            "IdBill": IdUser+phoneNumber,
            "IdUser": IdUser,
            "email": email,
            "address": address,
            "phoneNumber": phoneNumber,
            "dateBuy":dateBuy,
            "trangthai":"0",
            "tinhtrang":"0"
        }
    };
    
    console.log("Adding a new item...");
    docClient.put(params, function (err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            callback(data);
        }
    });
}
//Update Bill cho khach hang
exports.UpdateBill1 = (key1,key2) => {
    var params = {
        TableName: "Bill",
        Key: {
            "IdBill": key1,
            "IdUser": key2
        },
        UpdateExpression: "set tinhtrang=:d",
        ExpressionAttributeValues: {
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
}
exports.UpdateBill = (key1,key2) => {
    var params = {
        TableName: "Bill",
        Key: {
            "IdBill": key1,
            "IdUser": key2
        },
        UpdateExpression: "set trangthai=:d",
        ExpressionAttributeValues: {
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
}
// DeleteBill cua khach hang
exports.DeleteBill=(key1,key2,callback)=>{
    var params = {
        TableName:"Bill",
        Key:{
            "IdBill": key1,
            "IdUser":key2
        }
    };
    
    console.log("Attempting a conditional delete...");
    docClient.delete(params, function(err, data) {
        if (err) {
            console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
            var params = {
                TableName: "Bill",
                ProjectionExpression: "#yr,IdBill,address,phoneNumber,dateBuy,trangthai,email,tinhtrang",
                FilterExpression: "#yr between :start_yr and :end_yr ",
                ExpressionAttributeNames: {
                    "#yr": "IdUser",
                },
                ExpressionAttributeValues: {
                    ":start_yr": "A",
                    ":end_yr":"Z"
                }
            };
            docClient.scan(params, onScan);
            function onScan(err, data1) {
                if (err) {
                    console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    callback(data1);
                }
            }
           
        }
    });
}
//Lấy tất cả các bill info
exports.getAllBillinfo = (callback) => {
    var params = {
        TableName: "Billinfo",
        ProjectionExpression: "#yr,Idprod,quantity,hinhanh,tien,ten,gia,sodienthoai,diachi,tenkh",
        FilterExpression: "#yr between :start_yr and :end_yr",
        ExpressionAttributeNames: {
            "#yr": "IdBill",
        },
        ExpressionAttributeValues: {
            ":start_yr": "A",
            ":end_yr":"Z"
        }
    };
    docClient.scan(params, onScan);
    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log(data.Items.length);
            callback(data);
        }
    }
}
//Lay BillInfo bang id
exports.getBillinfoByid = (id, callback) => {
    var params = {
        TableName: "Billinfo",
        ProjectionExpression: "#yr,Idprod,quantity,hinhanh,tien,ten,gia,sodienthoai,diachi,tenkh",
        FilterExpression: "#yr =:yyyy ",
        ExpressionAttributeNames: {
            "#yr": "IdBill",
        },
        ExpressionAttributeValues: {
            ":yyyy":id
        }
    };
    docClient.scan(params, onScan);
    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Tim thanh cong : so luong :",data.Items.length);
            callback(data);
        }
    }
}
//Lay Billinfo By idprod
exports.getBillinfoByidprod = (id, callback) => {
    var params = {
        TableName: "Billinfo",
        ProjectionExpression: "#yr,IdBill,quantity",
        FilterExpression: "#yr =:yyyy ",
        ExpressionAttributeNames: {
            "#yr": "Idprod",
        },
        ExpressionAttributeValues: {
            ":yyyy": id
        }
    };
    docClient.scan(params, onScan);
    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log(data.Items.length);
            callback(data);
        }
    }
}
//Them Billinfo
exports.ThemBillInfo = ( idBill, idprod, quantity,img,tien,ten,gia,sodienthoai,diachi,tenkh) => {
    var params = {
        TableName: "Billinfo",
        Item: {
            "IdBill": idBill,
            "Idprod": idprod,
            "quantity": quantity,
            "hinhanh":img,
            "tien":tien,
            "ten":ten,
            "gia":gia,
            "sodienthoai":sodienthoai,
            "diachi":diachi,
            "tenkh":tenkh
        }
    };

    console.log("Adding a new item...");
    docClient.put(params, function (err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            console.log("Them Billinfo Thanh Cong");
            
           
        }
    });
}
// Update so luong
exports.UpdateQuantity = (key1, key2, soluong, callback) => {
    var params = {
        TableName: "Billinfo",
        Key: {
            "IdBillinfo": key1,
            "IdBill": key2
        },
        UpdateExpression: "set quantity = :n ",
        ExpressionAttributeValues: {
            ":n": soluong

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
            callback(data);
        }
    });
}
// DeleteBillinfo
exports.DeleteBillinfo=(key1,key2)=>{
    var params = {
        TableName:"Billinfo",
        Key:{
            "IdBill": key1,
            "Idprod": key2
        }
    };
    
    console.log("Attempting a conditional delete...");
    docClient.delete(params, function(err, data) {
        if (err) {
            console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
}
