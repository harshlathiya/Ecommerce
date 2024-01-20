const Category = require('../models/Category');
const Cate = require('../models/Category');
module.exports.insertCateData = async(req,res)=>{
    try {
        if(req.body){
            req.body.isActive = true;
            req.body.currentDate = new Date().toLocaleString();
            req.body.updateDate = new Date().toLocaleString();
            await Cate.create(req.body);
            return res.redirect('back');
        }
    }
    catch (error) {
        console.log(error);
        return res.redirect('back');
        
    }
}
module.exports.viewCate = async(req,res)=>{
    try {
        var search ="";
        if(req.query.search){
            search = req.query.search;
        }
        if(req.query.page){
            page = req.query.page;
        }
        else{
            page = 0;
        }
        var perPage = 12;

        let CateData = await Cate.find({
            $or :[
                {"cateName":{$regex : ".*"+search+".*",$options:"i"}},
            ]
        }).limit(perPage).skip(perPage*page);
        let totalCatedata = await Cate.find({
            $or :[
                {"cateName":{$regex : ".*"+search+".*",$options:"i"}},
            ]
        }).countDocuments();
        return res.render('viewCategory',{
            cateData : CateData,
            searchValue : search,
            totaldocument : Math.ceil(totalCatedata/perPage),
            currentPage : page
        })
    }
    catch (error) {
        console.log(error);
        return res.redirect('back');    
    }
}



module.exports.isActive = async(req,res)=>{
    try {
        if (req.params.id) {
            let active = await Category.findByIdAndUpdate(req.params.id, { isActive: false });
            if (active) {
                console.log("Data Deactive Successfully");
                return res.redirect('back');
            }
            else {
                console.log("Record Not Deactive");
                return res.redirect('back');
            }
        }
        else {
            console.log("Params Id not Found");
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}
module.exports.deActive = async(req,res)=>{
    try {
        if (req.params.id) {
            let active = await Category.findByIdAndUpdate(req.params.id, { isActive: true });
            if (active) {
                console.log("Data Isactive Successfully");
                return res.redirect('back');
            }
            else {
                console.log("Record Not Deactive");
                return res.redirect('back');
            }
        }
        else {
            console.log("Params Id not Found");
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.updatecat = async(req,res)=>{
    try {
        if (req.params.id) {
            let category = await Category.findById(req.params.id);
            if(category) {
               
                return res.render('updatecategory',{
                    cdata:category
                });
            }
            else {
                console.log("Record Not Found");
                return res.redirect('back');
            }
        }
        else {
            console.log("Params Id not Found");
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.updateCategoryData = async(req,res)=>{
    try {
        
        
            let oldData = await Category.findById(req.body.EditId);
            if (oldData) {
               // console.log(req.body);
                req.body.updateDate = new Date().toLocaleString();
                let ad = await Category.findByIdAndUpdate(req.body.EditId, req.body);

                if (ad) {
                    console.log("Record & Image Update Succesfully");
                    return res.redirect('/admin/category/viewCategory');
                }
                else {
                    console.log("Record Not Updated");
                    return res.redirect('/admin/category/viewCategory');
                }
           
        }
    }
    catch (error) {
        console.log(error);
        return res.redirect('/admin/viewAdmin');
    }
}