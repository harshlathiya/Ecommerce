const cat = require('../models/Category')
const scat = require('../models/Scate')
const ecat = require('../models/Ecate')
const Brand = require('../models/Brand')
const type = require('../models/Type')
const product = require('../models/product')
const cart = require('../models/cart')
const user = require('../models/user');
const bcrypt = require('bcrypt');
const order = require('../models/order')
const { body,validationResult } = require('express-validator')

var stripe = require('stripe')('sk_test_wFSjCKx4AW07JCc87b2fUwhH00zzjnRSJv');





module.exports.dashbord = async (req, res) => {
    var countCart = 0;
    var cartPendingData = ''
    if (req.user) {
        countCart = await cart.find({ userId: req.user.id, status: 'pending' }).countDocuments();
        cartPendingData = await cart.find({ userId: req.user.id, status: 'pending' }).populate('productId').exec();
    }
    let catdata = await cat.find({});
    let scatdata = await scat.find({});
    let ecatdata = await ecat.find({});

    return res.render('user/dashbord', {
        'cat': catdata,
        'scat': scatdata,
        'ecat': ecatdata,
        'cartData': cartPendingData,
        'countCart': countCart
    });
}

module.exports.userhome = async (req, res) => {
    var countCart = 0;
    var cartPendingData = ''
    if (req.user) {
        countCart = await cart.find({ userId: req.user.id, status: 'pending' }).countDocuments();
        cartPendingData = await cart.find({ userId: req.user.id, status: 'pending' }).populate('productId').exec();
    }
    let catdata = await cat.find({});
    let scatdata = await scat.find({});
    let ecatdata = await ecat.find({});
    let electronics = await scat.find({category:'659fdd06d605f31ce3cd1fe0'})
    return res.render('user/home', {
        'cat': catdata,
        'scat': scatdata,
        'ecat': ecatdata,
        'cartData': cartPendingData,
        'countCart': countCart,
        elec :electronics
    });
}

module.exports.checkout = async (req, res) => {
    var countCart = 0;
    var cartPendingData = ''
    if (req.user) {
        countCart = await cart.find({ userId: req.user.id, status: 'pending' }).countDocuments();
        cartPendingData = await cart.find({ userId: req.user.id, status: 'pending' }).populate('productId').exec();
        var sub = 0;
        for (var tp = 0; tp < cartPendingData.length; tp++) {
            sub = sub + cartPendingData[tp].quantity * cartPendingData[tp].productId.product_price;

        }

    }
    let catdata = await cat.find({});
    let scatdata = await scat.find({});
    let ecatdata = await ecat.find({});


    return res.render('user/checkout', {
        'cat': catdata,
        'scat': scatdata,
        'ecat': ecatdata,
        'cartData': cartPendingData,
        'countCart': countCart,
        'payment': sub,
        'key': "pk_test_5RzHjUwGCx0aBvQYxmMprB1200k4WeKjIa"
    });
}

module.exports.loginuser = async (req, res) => {
    let catdata = await cat.find({});
    let scatdata = await scat.find({});
    let ecatdata = await ecat.find({});
    var countCart = 0;
    var errors = ''
    var cartPendingData = ''
    if (req.user) {
        countCart = await cart.find({ userId: req.user.id, status: 'pending' }).countDocuments();
        cartPendingData = await cart.find({ userId: req.user.id, status: 'pending' }).populate('productId').exec();
    }

    return res.render('user/login', {
        'cat': catdata,
        'scat': scatdata,
        'ecat': ecatdata,
        'cartData': cartPendingData,
        'countCart': countCart,
        'errors':errors,
    });
}

module.exports.loginuserdirect = async (req, res) => {
    let catdata = await cat.find({});
    let scatdata = await scat.find({});
    let ecatdata = await ecat.find({});
    var countCart = 0;
    var errors = ''
    var cartPendingData = ''
    if (req.user) {
        countCart = await cart.find({ userId: req.user.id, status: 'pending' }).countDocuments();
        cartPendingData = await cart.find({ userId: req.user.id, status: 'pending' }).populate('productId').exec();
    }

    return res.render('user/login_main', {
        'cat': catdata,
        'scat': scatdata,
        'ecat': ecatdata,
        'cartData': cartPendingData,
        'countCart': countCart,
        'errors':errors,
    });
}

module.exports.prodetails = async (req, res) => {
    let catdata = await cat.find({});
    let scatdata = await scat.find({});
    let ecatdata = await ecat.find({});
    var countCart = 0;
    var cartPendingData = ''
    if (req.user) {
        countCart = await cart.find({ userId: req.user.id, status: 'pending' }).countDocuments();
        cartPendingData = await cart.find({ userId: req.user.id, status: 'pending' }).populate('productId').exec();
    }

    let singleproData = await product.findById(req.params.id).populate(['category', 'subcategory', 'extracategory', 'brandname', 'typeName']).exec();
    let more = singleproData.extracategory.id
    let morepro = await product.find({ extracategory: more });
    //console.log(morepro);

    return res.render('user/prodetails', {
        'cat': catdata,
        'scat': scatdata,
        'ecat': ecatdata,
        'pro': singleproData,
        'countCart': countCart ? countCart : 0,
        'pros': morepro,
        'cartData': cartPendingData,
        'countCart': countCart
    });
}

module.exports.prolist = async (req, res) => {
    let catdata = await cat.find({});
    let scatdata = await scat.find({});
    let ecatdata = await ecat.find({});
    var countCart = 0;
    var cartPendingData = ''
    if (req.user) {
        countCart = await cart.find({ userId: req.user.id, status: 'pending' }).countDocuments();
        cartPendingData = await cart.find({ userId: req.user.id, status: 'pending' }).populate('productId').exec();
    }
    var search = "";
    if (req.query.search) {
        search = req.query.search;
    }
    if (req.query.page) {
        page = req.query.page;
    }
    else {
        page = 0;
    }
    var perPage = 12;
    let productData = await product.find({
        category: req.params.cid, subcategory: req.params.sid, extracategory: req.params.eid,
        $or: [
            { "product_title": { $regex: ".*" + search + ".*", $options: "i" } },
        ]
    }).limit(perPage).skip(perPage * page).populate(['category', 'subcategory', 'extracategory', 'brandname', 'typeName']).exec();
    let totalTypedata = await product.find({
        category: req.params.cid, subcategory: req.params.sid, extracategory: req.params.eid,
        $or: [
            { "product_title": { $regex: ".*" + search + ".*", $options: "i" } },
        ]
    }).countDocuments();

    // //console.log(req.params.cid);
    // //console.log(req.params.sid);
    // //console.log(req.params.eid);
    //let productdata =  await product.find({category:req.params.cid,subcategory:req.params.sid,extracategory:req.params.eid}).populate(['category', 'subcategory','extracategory','brandname','typeName']).exec();
    ////console.log(productData);
    var max = 0;
    productData.map((v, i) => {
        if (parseInt(v.product_price) > max) {
            max = parseInt(v.product_price);
        }
    })
    min = max;

    productData.map((v, i) => {
        if (parseInt(v.product_price) < min) {
            min = parseInt(v.product_price);
        }
    })
    ////console.log(min,max);


    let brandName = [];
    productData.forEach((v, i) => {

        brandName.push({ name: v.brandname.brandname, id: v.brandname.id });
    })


    ////console.log(brandName);
    var brandNew = [];
    brandName.map((v, i) => {
        let pos = brandNew.findIndex((v1, i) => v1.name == v.name);

        if (pos == -1) {
            brandNew.push(v);
        }
    })


    return res.render('user/shopgride', {
        'cat': catdata,
        'scat': scatdata,
        'ecat': ecatdata,
        'pro': productData,
        cid: req.params.cid,
        sid: req.params.sid,
        eid: req.params.eid,
        searchValue: search,
        totaldocument: Math.ceil(totalTypedata / perPage),
        currentPage: page,
        min: min,
        max: max,
        brand: brandNew,
        'cartData': cartPendingData,
        'countCart': countCart
    });




}

module.exports.productlistallscat = async (req, res) => {
    let catdata = await cat.find({});
    let scatdata = await scat.find({});
    let ecatdata = await ecat.find({});
    var countCart = 0;
    var cartPendingData = ''
    if (req.user) {
        countCart = await cart.find({ userId: req.user.id, status: 'pending' }).countDocuments();
        cartPendingData = await cart.find({ userId: req.user.id, status: 'pending' }).populate('productId').exec();
    }
    var search = "";
    if (req.query.search) {
        search = req.query.search;
    }
    if (req.query.page) {
        page = req.query.page;
    }
    else {
        page = 0;
    }
    var perPage = 12;
    let productData = await product.find({
         subcategory: req.params.id,
        $or: [
            { "product_title": { $regex: ".*" + search + ".*", $options: "i" } },
        ]
    }).limit(perPage).skip(perPage * page).populate(['category', 'subcategory', 'extracategory', 'brandname', 'typeName']).exec();
    let totalTypedata = await product.find({
         subcategory: req.params.sid,
        $or: [
            { "product_title": { $regex: ".*" + search + ".*", $options: "i" } },
        ]
    }).countDocuments();

    // //console.log(req.params.cid);
    // //console.log(req.params.sid);
    // //console.log(req.params.eid);
    //let productdata =  await product.find({category:req.params.cid,subcategory:req.params.sid,extracategory:req.params.eid}).populate(['category', 'subcategory','extracategory','brandname','typeName']).exec();
    ////console.log(productData);
    var max = 0;
    productData.map((v, i) => {
        if (parseInt(v.product_price) > max) {
            max = parseInt(v.product_price);
        }
    })
    min = max;

    productData.map((v, i) => {
        if (parseInt(v.product_price) < min) {
            min = parseInt(v.product_price);
        }
    })
    ////console.log(min,max);


    let brandName = [];
    productData.forEach((v, i) => {

        brandName.push({ name: v.brandname.brandname, id: v.brandname.id });
    })


    ////console.log(brandName);
    var brandNew = [];
    brandName.map((v, i) => {
        let pos = brandNew.findIndex((v1, i) => v1.name == v.name);

        if (pos == -1) {
            brandNew.push(v);
        }
    })



    return res.render('user/shopgride3', {
        'cat': catdata,
        'scat': scatdata,
        'ecat': ecatdata,
        'pro': productData,
        sid: req.params.id,
        searchValue: search,
        totaldocument: Math.ceil(totalTypedata / perPage),
        currentPage: page,
        min: min,
        max: max,
        brand: brandNew,
        'cartData': cartPendingData,
        'countCart': countCart
    });




}

module.exports.productlistall = async (req, res) => {
    let catdata = await cat.find({});
    let scatdata = await scat.find({});
    let ecatdata = await ecat.find({});
    var countCart = 0;
    var cartPendingData = ''
    if (req.user) {
        countCart = await cart.find({ userId: req.user.id, status: 'pending' }).countDocuments();
        cartPendingData = await cart.find({ userId: req.user.id, status: 'pending' }).populate('productId').exec();
    }

    var search = "";
    if (req.query.search) {
        search = req.query.search;
    }
    if (req.query.page) {
        page = req.query.page;
    }
    else {
        page = 0;
    }
    var perPage = 12;
    let productData = await product.find({
        $or: [
            { "product_title": { $regex: ".*" + search + ".*", $options: "i" } },
        ]
    }).limit(perPage).skip(perPage * page).populate(['category', 'subcategory', 'extracategory', 'brandname', 'typeName']).exec();
    let totalTypedata = await product.find({
        $or: [
            { "product_title": { $regex: ".*" + search + ".*", $options: "i" } },
        ]
    }).countDocuments();


    //let productdata =  await product.find({category:req.params.cid,subcategory:req.params.sid,extracategory:req.params.eid}).populate(['category', 'subcategory','extracategory','brandname','typeName']).exec();
    ////console.log(productData);
    var max = 0;
    productData.map((v, i) => {
        if (parseInt(v.product_price) > max) {
            max = parseInt(v.product_price);
        }
    })
    min = max;

    productData.map((v, i) => {
        if (parseInt(v.product_price) < min) {
            min = parseInt(v.product_price);
        }
    })
    ////console.log(min,max);


    let brandName = [];
    productData.forEach((v, i) => {

        brandName.push({ name: v.brandname.brandname, id: v.brandname.id });
    })
    //console.log(brandName);


    ////console.log(brandName);
    var brandNew = [];
    brandName.map((v, i) => {
        let pos = brandNew.findIndex((v1, i) => v1.name == v.name);

        if (pos == -1) {
            brandNew.push(v);
        }
    })

    //console.log(brandNew);
    return res.render('user/shopgride2', {
        'cat': catdata,
        'scat': scatdata,
        'ecat': ecatdata,
        'pro': productData,
        searchValue: search,
        totaldocument: Math.ceil(totalTypedata / perPage),
        currentPage: page,
        min: min,
        max: max,
        brand: brandNew,
        'cartData': cartPendingData,
        'countCart': countCart
    });




}

module.exports.ajaxRangeFilter = async (req, res) => {
    ////console.log(req.body);
    let catdata = await cat.find({});
    let scatdata = await scat.find({});
    let ecatdata = await ecat.find({});
    var countCart = 0;
    var cartPendingData = ''
    if (req.user) {
        countCart = await cart.find({ userId: req.user.id, status: 'pending' }).countDocuments();
        cartPendingData = await cart.find({ userId: req.user.id, status: 'pending' }).populate('productId').exec();
    }
    var search = "";
    if (req.query.search) {
        search = req.query.search;
    }
    if (req.query.page) {
        page = req.query.page;
    }
    else {
        page = 0;
    }
    var perPage = 12;
    let productData = await product.find({
        category: req.body.cid, subcategory: req.body.sid, extracategory: req.body.eid,
        $or: [
            { "product_title": { $regex: ".*" + search + ".*", $options: "i" } },
        ]
    }).limit(perPage).skip(perPage * page).populate(['category', 'subcategory', 'extracategory', 'brandname', 'typeName']).exec();
    let totalTypedata = await product.find({
        category: req.body.cid, subcategory: req.body.sid, extracategory: req.body.eid,
        $or: [
            { "product_title": { $regex: ".*" + search + ".*", $options: "i" } },
        ]
    }).countDocuments();

    var list = productData.filter((v, i) => {
        if (parseInt(v.product_price) >= req.body.min && parseInt(v.product_price) <= req.body.max) {
            return v;
        }
    })
    // //console.log(list);
    // //console.log(req.params.cid);
    // //console.log(req.params.sid);
    // //console.log(req.params.eid);
    //let productdata =  await product.find({category:req.params.cid,subcategory:req.params.sid,extracategory:req.params.eid}).populate(['category', 'subcategory','extracategory','brandname','typeName']).exec();
    ////console.log(productData);

    let brandName = [];
    productData.forEach((v, i) => {

        brandName.push({ name: v.brandname.brandname, id: v.brandname.id });
    })


    ////console.log(brandName);
    var brandNew = [];
    brandName.map((v, i) => {
        let pos = brandNew.findIndex((v1, i) => v1.name == v.name);

        if (pos == -1) {
            brandNew.push(v);
        }
    })
    return res.render('user/ajaxRangeFilter', {
        'cat': catdata,
        'scat': scatdata,
        'ecat': ecatdata,
        'pro': list,
        cid: req.body.cid,
        sid: req.body.sid,
        eid: req.body.eid,
        searchValue: search,
        totaldocument: Math.ceil(totalTypedata / perPage),
        currentPage: page,
        brand: brandNew,
        'cartData': cartPendingData,
        'countCart': countCart
    })

}

module.exports.ajaxRangeFilter2 = async (req, res) => {
    ////console.log(req.body);
    let catdata = await cat.find({});
    let scatdata = await scat.find({});
    let ecatdata = await ecat.find({});
    var countCart = 0;
    var cartPendingData = ''
    if (req.user) {
        countCart = await cart.find({ userId: req.user.id, status: 'pending' }).countDocuments();
        cartPendingData = await cart.find({ userId: req.user.id, status: 'pending' }).populate('productId').exec();
    }
    var search = "";
    if (req.query.search) {
        search = req.query.search;
    }
    if (req.query.page) {
        page = req.query.page;
    }
    else {
        page = 0;
    }
    var perPage = 12;
    let productData = await product.find({
        $or: [
            { "product_title": { $regex: ".*" + search + ".*", $options: "i" } },
        ]
    }).limit(perPage).skip(perPage * page).populate(['category', 'subcategory', 'extracategory', 'brandname', 'typeName']).exec();
    let totalTypedata = await product.find({
        $or: [
            { "product_title": { $regex: ".*" + search + ".*", $options: "i" } },
        ]
    }).countDocuments();

    var list = productData.filter((v, i) => {
        if (parseInt(v.product_price) >= req.body.min && parseInt(v.product_price) <= req.body.max) {
            return v;
        }
    })
    // //console.log(list);
    // //console.log(req.params.cid);
    // //console.log(req.params.sid);
    // //console.log(req.params.eid);
    //let productdata =  await product.find({category:req.params.cid,subcategory:req.params.sid,extracategory:req.params.eid}).populate(['category', 'subcategory','extracategory','brandname','typeName']).exec();
    ////console.log(productData);

    let brandName = [];
    productData.forEach((v, i) => {

        brandName.push({ name: v.brandname.brandname, id: v.brandname.id });
    })


    ////console.log(brandName);
    var brandNew = [];
    brandName.map((v, i) => {
        let pos = brandNew.findIndex((v1, i) => v1.name == v.name);

        if (pos == -1) {
            brandNew.push(v);
        }
    })
    return res.render('user/ajaxRangeFilter', {
        'cat': catdata,
        'scat': scatdata,
        'ecat': ecatdata,
        'pro': list,
        searchValue: search,
        totaldocument: Math.ceil(totalTypedata / perPage),
        currentPage: page,
        brand: brandNew,
        'cartData': cartPendingData,
        'countCart': countCart
    })

}
module.exports.ajaxRangeFilter3 = async (req, res) => {
    ////console.log(req.body);
    let catdata = await cat.find({});
    let scatdata = await scat.find({});
    let ecatdata = await ecat.find({});
    var countCart = 0;
    var cartPendingData = ''
    if (req.user) {
        countCart = await cart.find({ userId: req.user.id, status: 'pending' }).countDocuments();
        cartPendingData = await cart.find({ userId: req.user.id, status: 'pending' }).populate('productId').exec();
    }
    var search = "";
    if (req.query.search) {
        search = req.query.search;
    }
    if (req.query.page) {
        page = req.query.page;
    }
    else {
        page = 0;
    }
    var perPage = 12;
    let productData = await product.find({
        subcategory: req.body.sid,
        $or: [
            { "product_title": { $regex: ".*" + search + ".*", $options: "i" } },
        ]
    }).limit(perPage).skip(perPage * page).populate(['category', 'subcategory', 'extracategory', 'brandname', 'typeName']).exec();
    let totalTypedata = await product.find({
         subcategory: req.body.sid,
        $or: [
            { "product_title": { $regex: ".*" + search + ".*", $options: "i" } },
        ]
    }).countDocuments();

    var list = productData.filter((v, i) => {
        if (parseInt(v.product_price) >= req.body.min && parseInt(v.product_price) <= req.body.max) {
            return v;
        }
    })


    let brandName = [];
    productData.forEach((v, i) => {

        brandName.push({ name: v.brandname.brandname, id: v.brandname.id });
    })


    ////console.log(brandName);
    var brandNew = [];
    brandName.map((v, i) => {
        let pos = brandNew.findIndex((v1, i) => v1.name == v.name);

        if (pos == -1) {
            brandNew.push(v);
        }
    })
    return res.render('user/ajaxRangeFilter', {
        'cat': catdata,
        'scat': scatdata,
        'ecat': ecatdata,
        'pro': list,
        sid: req.body.sid,

        searchValue: search,
        totaldocument: Math.ceil(totalTypedata / perPage),
        currentPage: page,
        brand: brandNew,
        'cartData': cartPendingData,
        'countCart': countCart
    })

}

module.exports.ajaxBrandFilter = async (req, res) => {



    //console.log(req.body);
    let catdata = await cat.find({});
    let scatdata = await scat.find({});
    let ecatdata = await ecat.find({});
    var countCart = 0;
    var cartPendingData = ''
    if (req.user) {
        countCart = await cart.find({ userId: req.user.id, status: 'pending' }).countDocuments();
        cartPendingData = await cart.find({ userId: req.user.id, status: 'pending' }).populate('productId').exec();
    }

    var search = "";
    if (req.query.search) {
        search = req.query.search;
    }
    if (req.query.page) {
        page = req.query.page;
    }
    else {
        page = 0;
    }
    var perPage = 12;
    let productData = await product.find({
        category: req.body.cid, subcategory: req.body.sid, extracategory: req.body.eid, brandname: req.body.brandId,
        $or: [
            { "product_title": { $regex: ".*" + search + ".*", $options: "i" } },
        ]
    }).limit(perPage).skip(perPage * page).populate(['category', 'subcategory', 'extracategory', 'brandname', 'typeName']).exec();
    let totalTypedata = await product.find({
        category: req.body.cid, subcategory: req.body.sid, extracategory: req.body.eid, brandname: req.body.brandId,
        $or: [
            { "product_title": { $regex: ".*" + search + ".*", $options: "i" } },
        ]
    }).countDocuments();
    //console.log(productData);

    return res.render('user/ajaxRangeFilter', {

        'cat': catdata,
        'scat': scatdata,
        'ecat': ecatdata,
        'pro': productData,
        cid: req.body.cid,
        sid: req.body.sid,
        eid: req.body.eid,
        searchValue: search,
        totaldocument: Math.ceil(totalTypedata / perPage),
        currentPage: page,
        'cartData': cartPendingData,
        'countCart': countCart
    })

}

module.exports.ajaxBrandFilter2 = async (req, res) => {



    //console.log(req.body);
    let catdata = await cat.find({});
    let scatdata = await scat.find({});
    let ecatdata = await ecat.find({});
    var countCart = 0;
    var cartPendingData = ''
    if (req.user) {
        countCart = await cart.find({ userId: req.user.id, status: 'pending' }).countDocuments();
        cartPendingData = await cart.find({ userId: req.user.id, status: 'pending' }).populate('productId').exec();
    }

    var search = "";
    if (req.query.search) {
        search = req.query.search;
    }
    if (req.query.page) {
        page = req.query.page;
    }
    else {
        page = 0;
    }
    var perPage = 12;
    let productData = await product.find({
        brandname: req.body.brandId,
        $or: [
            { "product_title": { $regex: ".*" + search + ".*", $options: "i" } },
        ]
    }).limit(perPage).skip(perPage * page).populate(['category', 'subcategory', 'extracategory', 'brandname', 'typeName']).exec();
    let totalTypedata = await product.find({
        brandname: req.body.brandId,
        $or: [
            { "product_title": { $regex: ".*" + search + ".*", $options: "i" } },
        ]
    }).countDocuments();
    ////console.log(productData);

    return res.render('user/ajaxRangeFilter', {

        'cat': catdata,
        'scat': scatdata,
        'ecat': ecatdata,
        'pro': productData,

        searchValue: search,
        totaldocument: Math.ceil(totalTypedata / perPage),
        currentPage: page,
        'cartData': cartPendingData,
        'countCart': countCart
    })

}

module.exports.ajaxBrandFilter3 = async (req, res) => {



    //console.log(req.body);
    let catdata = await cat.find({});
    let scatdata = await scat.find({});
    let ecatdata = await ecat.find({});
    var countCart = 0;
    var cartPendingData = ''
    if (req.user) {
        countCart = await cart.find({ userId: req.user.id, status: 'pending' }).countDocuments();
        cartPendingData = await cart.find({ userId: req.user.id, status: 'pending' }).populate('productId').exec();
    }

    var search = "";
    if (req.query.search) {
        search = req.query.search;
    }
    if (req.query.page) {
        page = req.query.page;
    }
    else {
        page = 0;
    }
    var perPage = 12;
    let productData = await product.find({
         subcategory: req.body.sid, brandname: req.body.brandId,
        $or: [
            { "product_title": { $regex: ".*" + search + ".*", $options: "i" } },
        ]
    }).limit(perPage).skip(perPage * page).populate(['category', 'subcategory', 'extracategory', 'brandname', 'typeName']).exec();
    let totalTypedata = await product.find({
         subcategory: req.body.sid, brandname: req.body.brandId,
        $or: [
            { "product_title": { $regex: ".*" + search + ".*", $options: "i" } },
        ]
    }).countDocuments();
    //console.log(productData);

    return res.render('user/ajaxRangeFilter', {

        'cat': catdata,
        'scat': scatdata,
        'ecat': ecatdata,
        'pro': productData,
        
        sid: req.body.sid,
        
        searchValue: search,
        totaldocument: Math.ceil(totalTypedata / perPage),
        currentPage: page,
        'cartData': cartPendingData,
        'countCart': countCart
    })

}

module.exports.userRegister = async (req, res) => {
    req.body.role = 'user';
    req.body.create_date = new Date().toLocaleString();
    req.body.updated_date = new Date().toLocaleString();
    const errors= validationResult(req);
    if(!errors.isEmpty()){

       

    let catdata = await cat.find({});
    let scatdata = await scat.find({});
    let ecatdata = await ecat.find({});
    var countCart = 0;
    
    var cartPendingData = ''
    if (req.user) {
        countCart = await cart.find({ userId: req.user.id, status: 'pending' }).countDocuments();
        cartPendingData = await cart.find({ userId: req.user.id, status: 'pending' }).populate('productId').exec();
    }
console.log(errors);
    return res.render('user/login', {
        'cat': catdata,
        'scat': scatdata,
        'ecat': ecatdata,
        'cartData': cartPendingData,
        'countCart': countCart,
        errors: errors.array()
    });

    
    }
    let checkemail = await user.findOne({ email: req.body.email });
    if (checkemail) {
        console.log("Email already register");
        return res.redirect('back');
    }
    else {
        if (req.body.password == req.body.cpassword) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
            await user.create(req.body);
            console.log('added');
            return res.redirect('/');
        }
        else {
            console.log("Password not match");
            return res.redirect('back');
        }
    }

}

module.exports.checkuserLogin = async (req, res) => {
    try {
        return res.redirect('/');
    }
    catch (err) {
        console.log(err);
        return res.redirect("back");
    }
}

module.exports.checkuserLogin = async (req, res) => {
    try {
        console.log('loggin');
        return res.redirect('/');
    }
    catch (err) {
        console.log(err);
        return res.redirect("back");
    }
}

module.exports.insertCart = async (req, res) => {
    try {
        let cartProduct = await cart.findOne({ productId: req.body.productId, userId: req.user.id });
        if (cartProduct) {
            console.log("Product is already into cart");
            return res.redirect("back");
        }
        else {
            req.body.userId = req.user.id;
            req.body.status = "pending";
            req.body.create_date = new Date().toLocaleString();
            req.body.updated_date = new Date().toLocaleString();
            let AddCart = await cart.create(req.body);
            if (AddCart) {
                console.log("Product add into cart");
                return res.redirect("back");
            }
            else {
                console.log("something is wrong");
                return res.redirect("back");
            }
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect("back");
    }
}

module.exports.viewcart = async (req, res) => {
    try {
        let countCart;
        if (req.user) {
            countCart = await cart.find({ userId: req.user.id, status: 'pending' }).countDocuments();
            cartPendingData = await cart.find({ userId: req.user.id, status: 'pending' }).populate('productId').exec();
        }
        let catdata = await cat.find({});
        let scatdata = await scat.find({});
        let ecatdata = await ecat.find({});

        return res.render('user/viewcart', {
            'cartData': cartPendingData,
            'cat': catdata,
            'scat': scatdata,
            'ecat': ecatdata,
            'countCart': countCart
        })
    }
    catch (err) {
        console.log(err);
        return res.redirect("back");
    }
}

module.exports.changeQuantity = async (req, res) => {
    try {
        await cart.findByIdAndUpdate(req.body.cartId, { quantity: req.body.quantity });
        return res.status(200).json({ msg: "Successfully change " });
    }
    catch (err) {
        console.log(err);
        return res.redirect("back");
    }
}

module.exports.deleteCart = async (req, res) => {
    try {
        let de = await cart.findByIdAndDelete(req.params.id)
        if (de) {
            console.log("Cart delete successfully");
            return res.redirect(back);
        }
        else {
            console.log("Record not found");
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect("back");
    }
}

module.exports.payment = async (req, res) => {
    try {
        
        var countCart = await cart.find({ userId: req.user.id, status: 'pending' }).countDocuments();
        var cartPendingData = await cart.find({ userId: req.user.id, status: 'pending' }).populate('productId').exec();
        var cartPendingData2 = await cart.find({ userId: req.user.id, status: 'pending' }).populate('productId').exec();
        var sub = 0;
        for (var i = 0; i < cartPendingData2.length; i++) {
            sub = sub + cartPendingData2[i].quantity * cartPendingData2[i].productId.product_price;

        }
        console.log(sub);
        console.log('run');
        stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: 'Gourav Hammad',
            address: {
                line1: 'TC 9/4 Old MES colony',
                postal_code: '452331',
                city: 'Indore',
                state: 'Madhya Pradesh',
                country: 'India',
            }
        })
        .then((customer) => {
     
            return stripe.charges.create({
                amount: sub,     // Charging Rs 25
                description: 'Web Development Product',
                currency: 'INR',
                customer: customer.id
            });
        })
        .then( async(charge) => {
            // If no error occurs
            console.log('run');
            var cartid =[];
            var proid=[];

            cartPendingData.forEach((v,i)=>{
                cartid.push(v.id)
                proid.push(v.productId.id)
            });
            console.log(cartid);
            console.log(proid);
            req.body.userId=req.user.id;
            req.body.productId=proid;
            req.body.status ="confirm";
            req.body.cartId=cartid;
            console.log('run4');
            var or = await order.create(req.body);
            console.log('runs................');
            if(or){
                cartPendingData.map(async(v,i)=>{
                    await cart.findByIdAndUpdate(v.id,{status:"confirm"})
                })
               return res.redirect('/')
            }


        })
        .catch((err) => {
           
            console.log(err);      // If some error occurs
        });
    
    }
    catch (err) {
        console.log(err);
        return res.redirect("back");

    }
}




