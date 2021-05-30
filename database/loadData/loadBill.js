

console.log("Importing Bill into DynamoDB. Please wait.");
exports.LoadBill = (docClient, fs) => {
    var allBill = JSON.parse(fs.readFileSync('./data/bill.json', 'utf8'));
    allBill.forEach(function (bill) {
        var params = {
            TableName: "Bill",
            Item: {
                "IdBill": bill.idBill,
                "IdUser": bill.idUser,
                "email": bill.email,
                "address": bill.address,
                "phoneNumber": bill.phoneNumber,
                "dateBuy": bill.dateBuy,
                "trangthai": bill.trangthai,
                "tinhtrang":bill.tinhtrang

            }
        };

        docClient.put(params, function (err, data) {
            if (err) {
                console.error("Unable to add movie", bill.idBill, ". Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("PutItem succeeded:", bill.idBill);
            }

        });
    });
}

