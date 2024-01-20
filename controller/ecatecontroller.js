const Category = require('../models/Category');
const Scate = require('../models/Scate');
const Ecate = require('../models/Ecate');
module.exports.addEcate = async (req, res) => {
    let cateRecord = await Category.find({});
    let scateRecord = await Scate.find({});
    return res.render('addEcate', {
        cateData: cateRecord,
        scateData: scateRecord
    });
}
module.exports.insertEcate = async (req, res) => {
    try {
        let EcateData = await Ecate.findOne({ ecateName: req.body.ecateName });
        if (EcateData) {
            console.log('Category already exists');
            return res.redirect('back');
        }
        else {
            req.body.isActive = true;
            req.body.currentDate = new Date().toLocaleString();
            req.body.updateDate = new Date().toLocaleString();
            await Ecate.create(req.body);
            return res.redirect('back');
        }
    }
    catch (error) {
        console.log(error);
        return res.redirect('back');
    }
}
module.exports.viewEcate = async (req, res) => {
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
        let EcateData = await Ecate.find({
            $or: [
                { "ecateName": { $regex: ".*" + search + ".*", $options: "i" } },
            ]
        }).limit(perPage).skip(perPage * page).populate(['category', 'subcategory']).exec();
        let totalEcatedata = await Ecate.find({
            $or: [
                { "ecateName": { $regex: ".*" + search + ".*", $options: "i" } },
            ]
        }).countDocuments();
        return res.render('viewEcate', {
            ecateData: EcateData,
            searchValue: search,
            totaldocument: Math.ceil(totalEcatedata / perPage),
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
            let active = await Ecate.findByIdAndUpdate(req.params.id, { isActive: false });
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
            let active = await Ecate.findByIdAndUpdate(req.params.id, { isActive: true });
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

module.exports.getsubcat = async(req,res)=>{
   try{
     //console.log(req.body)
     let subcatdata = await Scate.find({category : req.body.catid});
     // console.log(subcatdata)
      var optionsdata =   `<option value="">Select</option>`
      subcatdata.map((v,i)=>{
          optionsdata += `<option value="${v.id}">${v.scateName}</option>`
      })
      return res.json(optionsdata)
   }
   catch(err){
        console.log("select option");
   }
}

module.exports.updateecat = async(req,res)=>{
    try {
        if (req.params.id) {
            
            let extradata = await Ecate.findById(req.params.id).populate(['category','subcategory']).exec();
            //populate(['category', 'subcategory','extracategory','brandname','typeName']).exec();;
            if(extradata) {
               
                return res.render('updateecategory',{
                    edata:extradata
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

module.exports.updateecatdata = async(req,res)=>{
    try {
        
        
            let oldData = await Ecate.findById(req.body.EditId);
            if (oldData) {
               // console.log(req.body);
                req.body.updateDate = new Date().toLocaleString();
                let ad = await Ecate.findByIdAndUpdate(req.body.EditId, req.body);

                if (ad) {
                    console.log("Record & Image Update Succesfully");
                    return res.redirect('/admin/ecate/viewEcate');
                }
                else {
                    console.log("Record Not Updated");
                    return res.redirect('/admin/ecate/viewEcate');
                }
           
        }
    }
    catch (error) {
        console.log(error);
        return res.redirect('/admin/ecate/viewEcate');
    }
}