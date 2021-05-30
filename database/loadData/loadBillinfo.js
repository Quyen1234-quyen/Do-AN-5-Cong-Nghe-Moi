

console.log("Importing Billinfo into DynamoDB. Please wait.");
exports.LoadBillinfo = (docClient, fs) => {
    var allBill = JSON.parse(fs.readFileSync('./data/billinfo.json', 'utf8'));
    allBill.forEach(function (bill) {
        var params = {
            TableName: "Billinfo",
            Item: {
                "IdBill": bill.idBill,
                "Idprod": bill.idprod,
                "quantity": bill.quantity

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

