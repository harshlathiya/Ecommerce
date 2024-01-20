const Cate = require('../models/Category');
const SubCate = require('../models/Scate');
const ExtraCate = require('../models/Ecate');
const Brand = require('../models/Brand');
const Type = require('../models/Type');
module.exports.addType = async(req,res)=>{
    let Category = await Cate.find({});
    let Subcate = await SubCate.find({});
    let Extracate = await ExtraCate.find({});
    let BrandData = await Brand.find({});
    return res.render('addType',{
        cate : Category,
        subcate : Subcate,
        extracate : Extracate,
        brand : BrandData
    })
}
module.exports.insertType = async(req,res)=>{
    try {
        let CheckType = await Type.findOne({typeName : req.body.typeName});
        if(CheckType){
            console.log('Type already exsits');
            return res.redirect('back');
        }
        else{
            req.body.isActive = true;
            req.body.currentDate = new Date().toLocaleString();
            req.body.updateDate = new Date().toLocaleString();
            await Type.create(req.body);
            return res.redirect('back');
        }
    }
    catch (error) {
        console.log(error);
        return res.redirect('back')    
    }
}
module.exports.viewType = async(req,res)=>{
    try {
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
        let TypeData = await Type.find({
            $or: [
                { "typeName": { $regex: ".*" + search + ".*", $options: "i" } },
            ]
        }).limit(perPage).skip(perPage * page).populate(['category', 'subcategory','extracategory','brandname']).exec();
        let totalTypedata = await Type.find({
            $or: [
                { "typeName": { $regex: ".*" + search + ".*", $options: "i" } },
            ]
        }).countDocuments();
        return res.render('viewType', {
            typeData: TypeData,
            searchValue: search,
            totaldocument: Math.ceil(totalTypedata / perPage),
            currentPage: page,
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
            let active = await Type.findByIdAndUpdate(req.params.id, { isActive: false });
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
            let active = await Type.findByIdAndUpdate(req.params.id, { isActive: true });
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



module.exports.getbrands = async(req,res)=>{
    try{
        console.log(req.body)
    let branddata = await Brand.find({extracategory : req.body.ecatid});
   // console.log(subcatdata)
    var optionsdata =   `<option value="">Select</option>`
    branddata.map((v,i)=>{
        optionsdata += `<option value="${v.id}">${v.brandname}</option>`
    })
    return res.json(optionsdata)
    }
    catch(err){
         console.log("select option");
    }
}


module.exports.updatetype = async(req,res)=>{
    try {
        if (req.params.id) {
          
            let types = await Type.findById(req.params.id).populate(['category', 'subcategory','extracategory','brandname','typeName']).exec();
            //populate(['category', 'subcategory','extracategory','brandname','typeName']).exec();
            if(types){
               
                return res.render('updatetype',{
                    tdata:types
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

module.exports.updatetypedata = async(req,res)=>{
    try {
        
        
            let oldData = await Type.findById(req.body.EditId);
            if (oldData) {
               // console.log(req.body);
                req.body.updateDate = new Date().toLocaleString();
                let ad = await Type.findByIdAndUpdate(req.body.EditId, req.body);

                if (ad) {
                    console.log("Record & Image Update Succesfully");
                    return res.redirect('/admin/type/viewType');
                }
                else {
                    console.log("Record Not Updated");
                    return res.redirect('/admin/type/viewType');
                }
           
        }
    }
    catch (error) {
        console.log(error);
        return res.redirect('/admin/type/viewType');
    }
}