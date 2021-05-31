var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var AWS = require("aws-sdk");
var fs = require('fs');
var productDao = require('../models/ProductDao');
var userDao = require('../models/userDao');
var billDao = require('../models/BillDao');
var app = express();
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
AWS.config.update({
    region: "us-west-2",
    endpoint: "http://s3-us-west-2.amazonaws.com"
});
AWS.config.accessKeyId = "";
AWS.config.secretAccessKey = "";
var s3 = new AWS.S3({ params: { Bucket: 'vanquyen' } });
var sess;

//Login Admin
exports.loginUser = (req, res) => {
    var user = req.body.username;
    var pass = req.body.password;
    userDao.login(user, pass, (data) => {
        if (data.Count == 0) {
            var message = "Password or Username incorect ! ";
            res.end(`<script>
                alert( '${message}');
                window.location.href = '/loginadmin';
                </script>`);
        }
        else {
            data.Items.forEach(function (item) {
                if (item.lv == "2") {
                    sess = req.session;
                    sess.user = user;
                    sess.level = item.lv;
                    res.redirect('/admin');
                } else {
                    sess = req.session;
                    sess.user = user;
                    sess.pass = pass;
                    console.log("session", session);
                    productDao.getAllProductCategory(data => {
                        productDao.getAllProduct(data1 => {
                            return res.render('Homepage/index', {
                                username: user,
                                soluong: false,
                                data: data,
                                data1: data1

                            });
                        })

                    });

                }
            });

        }
    });
}
//View Trang Admin
exports.ViewLoginAdmin = (req, res) => {
    res.render('Admin/dangnhap');
}
exports.TrangAdmin = (req, res) => {
    sess = req.session
    if (sess.level == "2") {
        productDao.getAllProduct(data => {
            res.render('Admin/index', {
                admin: sess.user,
                data: data,
                data1: "",
                ma: "",
                ten: "",
                price: "",
                loai: "",
                mota: "",
                img: ""

            });
        });
    } else {
        res.redirect('/');
    }
}
//View User in Trang Admin
exports.Users = (req, res) => {
    sess = req.session
    if (sess.level == "2") {
        userDao.getAllUser(data => {
            res.render('Admin/user', {
                admin: sess.user,
                data: data,
                data1: "",
                ma: "",
                ten: "",
                price: "",
                loai: "",
                mota: "",
                img: ""

            });

        });
    } else {
        res.redirect('/');
    }
}
//View Bill in Trang Admin
exports.ListEmail = (req, res) => {
    var AWS = require("aws-sdk");
    AWS.config.update({
        region: "us-west-2",
    });
    AWS.config.accessKeyId = "AKIAID7V3NGIR6Z7A6FQ";
    AWS.config.secretAccessKey = "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";
    var ses = new AWS.SES();
    ses.listVerifiedEmailAddresses(function (err, data) {
        if (err) {
            res.send("loi");
        }
        else {
            data.VerifiedEmailAddresses.forEach(item => {
                if (item == "buockhoidau97@gmail.com") {
                    console.log(item);
                }
            });
            res.send(data);
        }
    });
}
exports.Bill = (req, res) => {
    var AWS = require("aws-sdk");
    AWS.config.update({
        region: "us-west-2",
    });
    AWS.config.accessKeyId = "AKIAID7V3NGIR6Z7A6FQ";
    AWS.config.secretAccessKey = "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";
    var ses = new AWS.SES();
    ses.listVerifiedEmailAddresses(function (err, data) {
        if (err) {
            res.send("loi11");
        }
        else {
            data.VerifiedEmailAddresses.forEach(item => {
                if (item == "buockhoidau97@gmail.com") {
                    console.log(item);
                }
            });
            res.send(data);
        }
    });
    // sess = req.session
    // if (sess.level == "2") {
    //     billDao.getAllBill(bill => {
    //         ses.listVerifiedEmailAddresses(function (err, data) {
    //             if (err) {
    //                 res.send("loi");
    //             }
    //             else {
    //                 billDao.getAllBillinfo(billinfo => {
    //                     res.render('Admin/bill', {
    //                         data: bill,
    //                         data1: data,
    //                         ma: "",
    //                         ten: "",
    //                         price: "",
    //                         loai: "",
    //                         mota: "",
    //                         img: ""

    //                     });
    //                 });
    //             }
    //         });

    //     })
    // } else {
    //     res.redirect('/');
    // }
}

exports.Them = (req, res) => {
    productDao.getAllProduct(data => {
        res.render('Admin/index', {
            data: data,
            data1: "",
            ma: "1",
            ten: "",
            price: "",
            loai: "",
            mota: "",
            img: ""
        })
    });
}
exports.themsanpham = (req, res) => {
    var Idprod = req.body.ma;
    var IdprodC = req.body.loai;
    var ten = req.body.ten;
    var price = req.body.gia;
    var mota = req.body.mota;
    var file = req.files.upload;
    var name = file.name;
    var data = file.data;
    var type = file.mimetype;
    var uploadpath = './uploads/' + name;
    var urlne = "https://s3-us-west-2.amazonaws.com/vanquyen/";
    file.mv(uploadpath, err => {
        if (err) {
            console.log("loi roi");
        }
        else {
            let uploadFile = {
                Key: name,
                Body: data,
                ContentType: req.files.upload.mimetype,
                ACL: 'public-read'
            }
            s3.putObject(uploadFile, function (err, data) {
                if (err) {
                    console.log('Error uploading data: ', data);
                }
                else {
                    console.log('succesfully uploaded the image!');
                }
            });
            // var img=urlne+name;
            var urlParams = { Bucket: 'vanquyen', Key: name };
            s3.getSignedUrl('getObject', urlParams, function (err, url) {
                console.log('the url of the image is', url);
                var url1 = urlne + name;
                productDao.getAllProductByid(Idprod, dataprod => {
                    if (dataprod.Count == 0) {
                        productDao.themsanpham(Idprod, IdprodC, ten, price, url1, mota, data1 => {
                            res.render('Admin/index', {
                                data: data1,
                                data1: "",
                                ma: "",
                                ten: "",
                                price: "",
                                loai: "",
                                mota: "",
                                img: ""
                            });
                        });
                    } else {
                        sess = req.session;
                        res.end(`<script>alert("ahihi..Trung Ma San Pham");window.location.href = '/admin';</script>`);
                    }


                });

            });

        }
    });

}
exports.alertXoaSanPham = (req, res) => {
    var id = req.params.id;
    var id1 = req.paramsid1;
    productDao.getAllProductByid(id, data => {
        res.render('XoaSanPham/xoaspadmin', {
            data: data
        })
    });
}
exports.xoasanpham = (req, res) => {
    var id = req.params.id;
    var id1 = req.params.id1;
    productDao.getProductBy2id(id, id1, data => {
        var img1 = data.Item.img;
        var position = img1.lastIndexOf('/') + 1;
        var img = img1.slice(position);

        var params = { Bucket: 'vanquyen', Key: img };
        fs.exists('./uploads/' + img, function (exists) {
            if (exists) {
                fs.unlinkSync('./uploads/' + img, function (err) {
                    if (err) return console.log(err);
                    console.log('file deleted successfully');
                });
            } else {
                //Show in red
                console.log('File not found, so not deleting.');
            }
        });

        s3.deleteObject(params, function (err, data) {
            if (err) {
                console.log("Ko thanh cong");
            }
            else {
                console.log("Xoa thanh cong");
            }
        });
        productDao.xoasanpham(id, id1, data => {
            res.render('Admin/index', {
                data: data,
                data1: "",
                ma: "",
                ten: "",
                price: "",
                loai: "",
                mota: "",
                img: ""
            });
        });
    });



}

exports.dispalyproFix = (req, res) => {
    var id = req.params.id;
    var id1 = req.params.id1;
    productDao.suasanpham(id, id1, data1 => {
        if(data1.Item){
            productDao.getAllProduct(data => {
                console.log(JSON.stringify(data1.Item.ten));
                res.render('Admin/index', {
                    data: data,
                    data1: data1,
                    ma: id,
                    ten: data1.Item.ten,
                    price: data1.Item.price,
                    loai: data1.Item.IdprodC,
                    mota: data1.Item.mieuta,
                    img: "",
                });
            });
            
        }else{
            res.end(`<script>alert("Vui Long Chon Lai");window.location.href = '/admin';</script>`);
        }


    });


}
//sua san pham
exports.suasanpham = (req, res) => {
    var Idprod = req.body.ma;
    var IdprodC = req.body.loai;
    var ten = req.body.ten;
    var price = req.body.gia;
    var mota = req.body.mota;
    var file = req.files.upload;

    if (typeof(file)=='undefined') {
        console.log(IdprodC);
        res.end(`<script>alert("Ban Chua Chon Anh");window.location.href = '/suaSP/${Idprod}/${IdprodC}';</script>`);
        console.log(IdprodC);
    }
    else {
        var name = file.name;
        var data = file.data;
        var type = file.mimetype;
        var uploadpath = './uploads/' + name;
        var urlne = "https://s3-us-west-2.amazonaws.com/vanquyen/";
        var img = urlne + name;

        productDao.suasanpham(Idprod, IdprodC, dt => {

            console.log(JSON.stringify(dt.Item.img));
            var img1 = dt.Item.img;
            var position = img1.lastIndexOf('/') + 1;
            var img2 = img1.slice(position);
            var params = { Bucket: 'vanquyen', Key: img2 };
            s3.deleteObject(params, function (err, data) {
                if (err) {
                    console.log("Ko thanh cong");
                }
                else {
                    console.log("Xoa thanh cong");
                }
            });
            fs.exists('./uploads/' + img2, function (exists) {
                if (exists) {
                    fs.unlinkSync('./uploads/' + img2, function (err) {
                        if (err) return console.log(err);
                        console.log('file deleted successfully');
                    });
                } else {
                    //Show in red
                    console.log('File not found, so not deleting.');
                }
            });
            file.mv(uploadpath, err => {
                if (err) {
                    console.log("loi roi");
                }
                else {
                    let uploadFile = {
                        Key: name,
                        Body: data,
                        ContentType: type,
                        ACL: 'public-read'
                    }
                    s3.putObject(uploadFile, function (err, data) {
                        if (err) {
                            console.log('Error uploading data: ', data);
                        }
                        else {
                            productDao.suasanphamComplete(Idprod, IdprodC, ten, price, img, mota, data => {
                                res.render('Admin/index', {
                                    data: data,
                                    ma: "",
                                    ten: "",
                                    price: '',
                                    loai: '',
                                    mota: '',
                                    img: ''
                                })
                            });
                        }
                    });
                }
            });
        });
    }


}
exports.huybo = (req, res) => {

    productDao.getAllProduct(data => {
        res.render('Admin/index', {
            data: data,
            ma: "",
            ten: "",
            price: "",
            loai: "",
            img: "",
            mota: ""
        })
    })
}
//Tìm Sản Phẩm
exports.TimSanPham = (req, res) => {
    var key = req.body.key;
    productDao.getAllProduct(data => {
        var data2 = [];
        data2.Items = data.Items.filter(item => {
            return item.ten.toLowerCase().indexOf(key) !== -1;
        });
        res.render('Admin/index', {
            data: data2,
            ma: "",
            ten: "",
            price: "",
            loai: "",
            img: "",
            mota: ""
        })
    });


}
//Tim San Pham Index
exports.TimSPindex = (req, res) => {
    var key = req.body.key;
    productDao.getAllProductCategory(data3 => {
        productDao.getAllProduct(data => {
            var data2 = [];
            data2.Items = data.Items.filter(item => {
                return item.ten.toLowerCase().indexOf(key) !== -1;
            });
            var user = "";
            res.render('Homepage/index', {
                data1: data2,
                username: user,
                soluong: false,
                data: data3
            })
        });
    });
}
//Xep A->Z
exports.xepAZ = (req, res) => {
    productDao.getAllProduct(data => {
        var data2 = [];
        data2.Items = data.Items.sort((a, b) => {
            if (a.ten > b.ten) return 1;
            else if (a.ten < b.ten) return -1;
            else return 0;
        });
        res.render('Admin/index', {
            data: data2,
            ma: "",
            ten: "",
            price: "",
            loai: "",
            img: "",
            mota: ""
        })

    });
}
//Xep Z->A
exports.xepZA = (req, res) => {
    productDao.getAllProduct(data => {
        var data2 = [];
        data2.Items = data.Items.sort((a, b) => {
            if (a.ten > b.ten) return -1;
            else if (a.ten < b.ten) return 1;
            else return 0;
        });
        res.render('Admin/index', {
            data: data2,
            ma: "",
            ten: "",
            price: "",
            loai: "",
            img: "",
            mota: ""
        })
    })
}



