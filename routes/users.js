var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var url = require('url');
var fs = require('fs');
var app = express();


app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var userDao = require('../models/userDao');
var billDao = require('../models/BillDao');
var productDao = require('../models/ProductDao');
var sess;
var giohang = new Array(GioHang);
giohang.pop();
var soluong = 0;
var tongtien = 0;

// Trang Chủ
var product = [];
exports.viewHomePage = (req, res) => {
    productDao.getAllProductCategory(data => {
        productDao.getAllProduct(data1 => {
            sess = req.session;
            if (sess.level == 2) {
                req.session.destroy();
                res.redirect('/');
            } else {
                res.render("Homepage/index", {
                    username: sess.user,
                    soluong: soluong,
                    data: data,
                    data1: data1.Items
                });
            }
        })

    });


}
// Tiến hành đăng nhập
// exports.loginUser = (req, res) => {
//     var user = req.body.username;
//     var pass = req.body.password;
//     userDao.login(user, pass, (data) => {
//         if (data.Count == 0) {
//             var message = "Password or Username incorect ! ";
//             res.end(`<script>
//                 alert( '${message}');
//                 window.location.href = '/';
//                 </script>`);
//         }
//         else {
//             data.Items.forEach(function (item) {
//                 if (item.lv == "2") {
//                     sess = req.session;
//                     sess.user = user;
//                     sess.level = item.lv;
//                     res.redirect('/admin');
//                 } else {
//                     sess = req.session;
//                     sess.user = user;
//                     sess.pass = pass;
//                     console.log("session", session);
//                     productDao.getAllProductCategory(data => {
//                         productDao.getAllProduct(data1 => {
//                             return res.render('Homepage/index', {
//                                 username: user,
//                                 soluong: false,
//                                 data: data,
//                                 data1: data1

//                             });
//                         })

//                     });

//                 }
//             });

//         }
//     });
// }
//Tiến Hành đăng kí
exports.SigninUser = (req, res) => {
    var user = req.body.username;
    var pass = req.body.password;
    var email = req.body.email;
    var add = req.body.address;
    userDao.signinUser(user, pass, email, add, (data) => {

        if (data == "undefined") {
            res.end(`<script>alert("ahihi..loi roi nha");window.location.href = '/';</script>`);
        } else {
            console.log("soluong", JSON.stringify(data));
            res.end(`<script>
                alert(  'Dang Ky Thanh Cong'+'Ten : ${user} ,'+
                        'Pass : ${pass} ,'+
                        'Email : ${email} ,'+
                        'Address : ${add} ');
                window.location.href = '/';
                </script>`);
        }
    });
}
//Thoát 
exports.Thoat = (req, res) => {
    giohang.splice(0, giohang.length);
    Soluong(giohang);
    req.session.destroy();
    productDao.getAllProductCategory(data => {
        productDao.getAllProduct(data1 => {
            var user = "";
            res.render("Homepage/index", {
                username: user,
                soluong: soluong,
                data: data,
                data1: data1
            });
        })

    });
}
// Lấy tất cả User
exports.getAllUser = (req, res) => {
    userDao.getAllUser(data => {
        res.render('Admin/index', {
            data: data
        })
    });
}
var list;
var xuat = [];
// Tìm Sản Phẩm 
exports.TimSanPham = (req, res) => {
    xuat.splice(0, xuat.length);
    var key = req.body.key;
    var request = require("request");
    var url = "https://search-search97-pbenqqgsb4kqgzkws2kpjzov6e.us-west-2.es.amazonaws.com/_search?pretty=true&q=" + key;
    var URL = encodeURI(url);
    request({
        url: URL,
        json: true
    }, function (error, response, body) {

        for (var i = 0; i < body.hits.hits.length; i++) {
            if (typeof body.hits.hits[i] != 'undefined') {
                list = body.hits.hits[i]._source;
                xuat.push(list);
            }
        }

        for (var j = 0; j < xuat.length; j++) {
            console.log(xuat[j]);
        }
    });

    productDao.getAllProductCategory(data3 => {
        productDao.getAllProduct(data => {
            // var data2 = [];
            // data2.Items = data.Items.filter(item => {
            //     return item.ten.toLowerCase().indexOf(key) !== -1;
            // });
            var user = "";
            res.render('Homepage/index', {
                data1: xuat,
                username: user,
                soluong: soluong,
                data: data3
            })
        });
    });
}

// tìm sản phẩm theo category
exports.SanPham = (req, res) => {
    sess = req.session;
    var id = req.params.id;
    productDao.getAllProductCategory(data => {
        productDao.getAllProductCategoryByid(id, data1 => {
            res.render("Homepage/index", {
                username: sess.user,
                soluong: soluong,
                data: data,
                data1: data1.Items,
            });

        })

    });
}

// Xem Gio Hàng
exports.ViewGioHang = (req, res) => {
    sess = req.session;
    TongTien(giohang);
    Soluong(giohang);
    productDao.getAllProductCategory(data => {
        res.render('GioHang/index', {
            username: sess.user,
            giohang: giohang,
            soluong: soluong,
            tongtien: tongtien,
            data: data
        });
    })
}
//Thêm Sản Phẩm vào giỏ hàng
exports.AddCart = (req, res) => {
    sess = req.session;
    ThemSanPhamVaoGioHang(req, res);
    productDao.getAllProductCategory(data => {
        productDao.getAllProduct(data1 => {
            res.render("Homepage/index", {
                username: sess.user,
                soluong: soluong,
                data: data,
                data1: data1.Items
            });
        })

    });
}
function GioHang(tensp, giasp, soluong, tien, id, img) {
    this.tensp = tensp;
    this.giasp = giasp;
    this.soluong = soluong;
    this.tien = tien;
    this.id = id;
    this.img = img;
}
function ThemSanPhamVaoGioHang(req, res) {
    var id = req.params.id;
    var tensp, giasp, soluong, tien, id, img;
    if (giohang.length == 0) {
        productDao.getAllProductByid(id, prod => {
            prod.Items.forEach(itemprod => {
                tensp = itemprod.ten;
                giasp = itemprod.price;
                soluong = 1;
                tien = soluong * giasp;
                id = itemprod.Idprod;
                img = itemprod.img;
                var x = new GioHang(tensp, giasp, soluong, tien, id, img);
                giohang.push(x);
                Soluong(giohang);

            });
        });

    }
    if (giohang.length >= 1) {
        var dem = [];
        for (var i = 0; i < giohang.length; i++) {
            if (id === giohang[i].id) {
                dem.push(1);
            }
        }
        if (dem.length == 0) {
            productDao.getAllProductByid(id, prod => {
                prod.Items.forEach(itemprod => {
                    tensp = itemprod.ten;
                    giasp = itemprod.price;
                    soluong = 1;
                    tien = soluong * giasp;
                    id = itemprod.Idprod;
                    img = itemprod.img;
                    var x = new GioHang(tensp, giasp, soluong, tien, id, img);
                    giohang.push(x);
                    Soluong(giohang);
                });
            });
        }
        if (dem.length == 1) {
            for (var i = 0; i < giohang.length; i++) {
                if (id === giohang[i].id) {
                    giohang[i].soluong += 1;
                    giohang[i].tien = giohang[i].soluong * giohang[i].giasp;
                    Soluong(giohang);
                }
            }
        }
    }


}
// thêm sản phẩm khi đã có trong giỏ hàng
exports.ThemSoLuong = (req, res) => {
    var id = req.params.id;
    for (var i = 0; i < giohang.length; i++) {
        if (giohang[i].id == id) {
            giohang[i].soluong += 1;
            giohang[i].tien = giohang[i].soluong * giohang[i].giasp;
        }
    }
    sess = req.session;
    TongTien(giohang);
    Soluong(giohang);
    productDao.getAllProductCategory(data => {
        res.render('GioHang/index', {
            data: data,
            username: sess.user,
            giohang: giohang,
            soluong: soluong,
            tongtien: tongtien
        });
    })

}
// giảm số lượng trong giỏ hàng
exports.GiamSoLuong = (req, res) => {
    var id = req.params.id;

    for (var i = 0; i < giohang.length; i++) {
        if (giohang[i].id == id) {
            if (giohang[i].soluong > 1) {
                giohang[i].soluong -= 1;
                giohang[i].tien = giohang[i].soluong * giohang[i].giasp;
            }

        }
    }

    sess = req.session;
    TongTien(giohang);
    Soluong(giohang);
    productDao.getAllProductCategory(data => {
        res.render('GioHang/index', {
            data: data,
            username: sess.user,
            giohang: giohang,
            soluong: soluong,
            tongtien: tongtien
        });
    })
}
// tong tien gio hang
function TongTien(giohang) {
    tongtien = 0;
    for (var i = 0; i < giohang.length; i++) {
        tongtien += giohang[i].tien;
    }
}
//so luong gio hang
function Soluong(giohang) {
    soluong = 0;
    for (var i = 0; i < giohang.length; i++) {
        soluong += giohang[i].soluong;
    }
}
//xóa sản phẩm trong giỏ hàng
exports.XoaSanPhamGioHang = (req, res) => {
    var id = req.params.id;
    for (var i = 0; i < giohang.length; i++) {
        if (giohang[i].id == id) {
            giohang.splice(i, 1);
            // luc nay i se ve -1 va tiep theo no se cong le 1 =0 tiep tuc duyet
        }
    }
    TongTien(giohang);
    Soluong(giohang);
    productDao.getAllProductCategory(data => {
        res.render('GioHang/index', {
            data: data,
            username: sess.user,
            giohang: giohang,
            soluong: soluong,
            tongtien: tongtien
        });
    })

}

var AWS = require("aws-sdk");
AWS.config.update({
    region: "us-west-2",
});
AWS.config.accessKeyId = "AKIAID7V3NGIR6Z7A6FQ";
AWS.config.secretAccessKey = "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";
var ses = new AWS.SES();
exports.XacNhanMuaHang = (req, res) => {
    var ten = req.body.iten;
    var email = req.body.iemail;
    var sodienthoai = req.body.isdt;
    var diachi = req.body.idc;
    var date = new Date();
    var thang = parseInt(date.getMonth()) + 1;
    var dateBuy = date.getDate() + "/" + thang + "/" + date.getFullYear();
    billDao.ThemBill(ten, diachi, sodienthoai, dateBuy, email, data => {
        for (var i = 0; i < giohang.length; i++) {
            billDao.ThemBillInfo(ten + sodienthoai, giohang[i].id, giohang[i].soluong, giohang[i].img, giohang[i].tien, giohang[i].tensp, giohang[i].giasp, sodienthoai, diachi, ten);
        }
        if (data == "undefined" || data == "") {
            res.end(`<script>alert("ahihi..loi roi nha");window.location.href = '/';</script>`);
        } else {
            var params = {
                EmailAddress: email
            };

            ses.verifyEmailAddress(params, function (err, data) {
                if (err) {
                    res.end(`<script>
                            alert('Email khong ton tai,'+
                            'Email : ${email} );
                            window.location.href = '/giohang';
                            </script>`);
                }
                else {
                    giohang.splice(0, giohang.length);
                    res.end(`<script>
                            alert(  'Don Hang Dang Se Duoc Duyet Sau Khi Ban Xac Nhan Email : '+'Ten : ${ten} ,'+
                            'Dia Chi : ${diachi} ,'+
                            'Email : ${email} ,'+
                            'So Dien Thoai : ${sodienthoai} ,'+
                            'Ngay : ${dateBuy}');
                            window.location.href = '/giohang';
                            </script>`);
                }
            });


        }
    });

}
exports.Bill = (req, res) => {
    ses.listVerifiedEmailAddresses(function (err, data) {
        if (err) {
            res.send("loi");
        }
        else {
            sess = req.session
            if (sess.level == "2") {
                billDao.getAllBill(bill => {
                    bill.Items.forEach(billitem => {
                        for (var i = 0; i < data.VerifiedEmailAddresses.length; i++) {
                            if (billitem.email == data.VerifiedEmailAddresses[i]) {
                                billDao.UpdateBill1(billitem.IdBill, billitem.IdUser);

                            }
                        }
                    });

                });
                billDao.getAllBill(data => {
                    billDao.getAllBillinfo(billinfo => {
                        res.render('Admin/bill', {
                            data: data,
                            data1: billinfo,
                            ma: "",
                            ten: "",
                            price: "",
                            loai: "",
                            mota: "",
                            img: ""
                        });
                    });
                })
            } else {
                res.redirect('/');
            }
        }
    });
}




exports.duyetBill = (req, res) => {
    var id = req.params.id;
    var id1 = req.params.id1;
    var email = req.params.e;
    
    billDao.getBillByiD(id, data => {
        data.Items.forEach(item => {
            if (item.tinhtrang == 0) {
                res.end(`<script>alert('Email Chua Duoc Xac Nhan !');window.location.href = '/bill';</script> `)
            }
            else {
                billDao.UpdateBill(id, id1);
                billDao.getAllBill(data => {
                    var eparam = {
                        Destination: {
                            ToAddresses: [email]
                        },
                        Message: {
                            Body: {
                                Html: {
                                    Data: "<p>Đơn Hàng Của Bạn Đang Được Giao</p>"



                                },
                                Text: {
                                    Data: "Don Hang Cua Ban"
                                }
                            },
                            Subject: {
                                Data: "Đon Hàng Của Bạn Đã Đc Xác Nhận"
                            }
                        },
                        Source: "quyenproshen@gmail.com",
                        ReplyToAddresses: ["quyenproshen@gmail.com"],
                        ReturnPath: "quyenproshen@gmail.com"
                    };

                    ses.sendEmail(eparam, function (err, data) {
                        if (err) {

                        }
                        else {
                            var params = {
                                Identity: email
                            };
                            ses.deleteIdentity(params, function (err, data) {
                                if (err) console.log(); // an error occurred
                                else console.log();           // successful response

                            });
                        }
                    });

                    billDao.getAllBill(data => {
                        billDao.getAllBillinfo(data1 => {
                            res.render('Admin/bill', {
                                data: data,
                                data1: data1,
                                ma: "",
                                ten: "",
                                price: "",
                                loai: "",
                                mota: "",
                                img: ""

                            });
                        });
                    });
                });
            }
        });
    });


}

exports.XemChiTiet = (req, res) => {
    var id = req.params.id;
    billDao.getBillinfoByid(id, data => {
        res.render('ChiTietBill/chitiet', {
            data: data
        });
    });
}

exports.XoaBill = (req, res) => {
    var id = req.params.id;
    billDao.getBillByiD(id, data => {
        res.render('XoaBill/xoabill', {
            data: data
        });
    });
}
exports.XoaBillLuon = (req, res) => {
    var id = req.params.id;
    var id1 = req.params.id1;
    billDao.getBillByiD(id, data => {
        data.Items.forEach(item => {
            var params = {
                Identity: item.email
            };
            ses.deleteIdentity(params, function (err, data) {
                if (err) console.log();
                else {
                    billDao.getBillinfoByid(id, data => {
                        data.Items.forEach(item => {
                            billDao.DeleteBillinfo(item.IdBill, item.Idprod);
                        });
                    });
                    billDao.DeleteBill(id, id1, bill => {
                        billDao.getAllBillinfo(billifo => {
                            res.render('Admin/bill', {
                                data: bill,
                                data1: billifo,
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

            });
        });
    });



}





