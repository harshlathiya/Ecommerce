
const category = require("../models/Category");
const subcategory = require("../models/Scate");
const extracategory = require("../models/Ecate");
const brand = require("../models/Brand");
const type = require("../models/Type");
const product = require("../models/product");
const path = require('path');
const fs = require('fs');
const { log } = require("console");

module.exports.add_product = async (req, res) => {
    let Category = await category.find({});
    let Subcate = await subcategory.find({});
    let Extracate = await extracategory.find({});
    let BrandData = await brand.find({});
    let typeData = await type.find({});

    return res.render("Add_product", {
        cate : Category,
        subcate : Subcate,
        extracate : Extracate,
        brand : BrandData,
        typeData: typeData
    });
}

module.exports.view_product = async (req, res) => {



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
        let productData = await product.find({
            $or: [
                { "product_title": { $regex: ".*" + search + ".*", $options: "i" } },
            ]
        }).limit(perPage).skip(perPage * page).populate(['category', 'subcategory','extracategory','brandname','typeName']).exec();
        let totalTypedata = await product.find({
            $or: [
                { "product_title": { $regex: ".*" + search + ".*", $options: "i" } },
            ]
        }).countDocuments();
        return res.render('View_product', {
            productData: productData,
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

module.exports.insert_product = async (req, res) => {
    try{
        let singleimag = '';
        let multipleimg = [];
        if(req.files){
            singleimag = await product.prsingleimg+'/'+req.files.ProductImage[0].filename;   
        }
        for(var i=0;i<req.files.multipleproductimage.length;i++){
            multipleimg.push(product.prmulimg+"/"+req.files.multipleproductimage[i].filename); 
        }
        req.body.ProductImage = singleimag;
        req.body.multipleproductimage = multipleimg;
        req.body.IsActive = true;
        req.body.Create_Date = new Date().toLocaleString();
        req.body.Upadate_Date = new Date().toLocaleString();
        let productdata = await product.create(req.body);
        if(productdata){
            console.log("product add..");
            return res.redirect('back');    
        }
        else{
            console.log("product can't add..");
            return res.redirect('back');
        }

    }
    catch(err){
        console.log("product is not defind..!");
        return res.redirect('back')
    }
}

module.exports.getBrandType = async (req, res) => {
    try {
        // console.log(req.body);
        let brandData = await brand.find({
            categoryId: req.body.categoryId,
            subcategoryId: req.body.subcategoryId,
            extracategoryId: req.body.extracategoryId,
        });
        let typeData = await type.find({
            categoryId: req.body.categoryId,
            subcategoryId: req.body.subcategoryId,
            extracategoryId: req.body.extracategoryId,
        });
        // console.log(brandData);
        // console.log(typeData);
        return res.render("Admin_pages/ajaxBrandType", {
            brandData: brandData,
            typeData: typeData,
        });
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};



module.exports.isActive = async(req,res)=>{
    try {
        if (req.params.id) {
            let active = await product.findByIdAndUpdate(req.params.id, { IsActive: false });
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
            let active = await product.findByIdAndUpdate(req.params.id, { IsActive: true });
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

module.exports.deleteimg = async(req,res)=>{
    try {
      // console.log(req.body.img);
       var  productsdata = await product.findById(req.body.id);
      
      var de = productsdata.multipleproductimage.splice(req.body.i,1);
      //console.log(de);
        
        var fullPath =  path.join(__dirname,'..',req.body.img);
        //console.log(fullPath);
        //console.log(productsdata);
        await fs.unlinkSync(fullPath);
       var datas = await product.findByIdAndUpdate(req.body.id,productsdata)
      // console.log(datas);
       if(datas) {
          console.log("Data Updated Successfully");
            return res.redirect('/admin/product/view_product');
        }
        else {
          console.log("Record Not Updated Successfully");
             return res.redirect('/admin/product/view_product');
        }

    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}
//delete product
module.exports.deletAdmin = async(req,res)=>{
    try {
        let oldData = await product.findById(req.params.id);
        var oldimages = oldData.multipleproductimage;
        if(oldimages.length>=1){
            console.log('run');
            for(var i=0 ; i<oldimages.length;i++){
                console.log(oldimages[i]);
                var imgpath = path.join(__dirname,'..',oldimages[i]);
                console.log(imgpath);
                await fs.unlinkSync(imgpath)
            }
        }
        if (oldData) {
            var oldImage = oldData.ProductImage;
           
            if (oldImage) {
                let fullPath = path.join(__dirname,'..',oldData.ProductImage);
                await fs.unlinkSync(fullPath);
                console.log(oldimages);
                
               let deletData = await product.findByIdAndDelete(req.params.id);
                if (deletData) {
                    console.log("Record & Image Delet Succesfully");
                    return res.redirect('back');
                }
                else {
                    console.log("Record Delet Succesfully");
                    return res.redirect('back');
                }
            }
           else {
                let deletData = await product.findByIdAndDelete(req.params.id);
                if (deletData) {
                    console.log("Admin Data not Delet");
                    return res.redirect('back');
                }
                else {
                    console.log("Admin Record Deleted");
                    return res.redirect('back');
                }
           }
        }
        else {
            console.log("Record Not Found");
            return res.redirect('back');
        }
    }
    catch (error) {
       console.log(error);
       return res.redirect('back');    
   }
}

module.exports.updateproduct = async(req,res)=>{
    try {
        let productRecord = await product.findById(req.params.id).populate(['category', 'subcategory','extracategory','brandname','typeName']).exec();;
        //console.log(productRecord);
        let Category = await category.find({});
        let Subcate = await subcategory.find({});
        let Extracate = await extracategory.find({});
        let BrandData = await brand.find({});
        let typeData = await type.find({});
        if (productRecord) {
            return res.render('updateproduct', {
               
                productRecord: productRecord,
                cate : Category,
                subcate : Subcate,
                extracate : Extracate,
                brand : BrandData,
                typeData: typeData
            })
        }
        else {
            console.log('Record Not Found');
            return res.redirect('back');
        }
    }
    catch (error) {
        console.log(error);
        return res.redirect('back');
    }
}


module.exports.edit_product = async(req,res)=>{
    //console.log(req.files);
    //console.log(req.files.ProductImage);
    //console.log(req.files.ProductImage[0].filename);

    try {
        if (req.files.ProductImage) {
            let oldData = await product.findById(req.body.EditId);
            if (oldData) {
                if (oldData.ProductImage) {
                    let fullPath = path.join(__dirname,'..',oldData.ProductImage);
                    await fs.unlinkSync(fullPath);
                }
                if(req.files.multipleproductimage){
                    let multipleimg = [];
                    let oldpro = await product.findById(req.body.EditId);
                    
                   // console.log(oldpro.multipleproductimage[0]);
                     for(var j=0;j<oldpro.multipleproductimage.length;j++){
                         multipleimg.push(oldpro.multipleproductimage[j]); 
                     }
                    for(var i=0;i<req.files.multipleproductimage.length;i++){
                        multipleimg.push(product.prmulimg+"/"+req.files.multipleproductimage[i].filename); 
                    }
                    req.body.multipleproductimage = multipleimg;
                }
                var productImagePath = product.prsingleimg+'/'+req.files.ProductImage[0].filename;
                req.body.ProductImage = productImagePath;
               
                req.body.Upadate_Date = new Date().toLocaleString();
                let ad = await product.findByIdAndUpdate(req.body.EditId, req.body);
                if (ad) {
                    console.log("Record & Image Update Succesfully");
                    return res.redirect('/admin/product/view_product');
                }
                else {
                    console.log("Record Not Updated");
                    return res.redirect('/admin/product/view_product');
                }
            }
            else {
                console.log("Record Not Updated");
                return res.redirect('/admin/product/view_product');
            }
        }
        else {
            let oldData = await product.findById(req.body.EditId);
            if (oldData) {
                if(req.files.multipleproductimage){
                    let multipleimg = [];
                    let oldpro = await product.findById(req.body.EditId);
                    
                   // console.log(oldpro.multipleproductimage[0]);
                     for(var j=0;j<oldpro.multipleproductimage.length;j++){
                         multipleimg.push(oldpro.multipleproductimage[j]); 
                     }
                    for(var i=0;i<req.files.multipleproductimage.length;i++){
                        multipleimg.push(product.prmulimg+"/"+req.files.multipleproductimage[i].filename); 
                    }
                    req.body.multipleproductimage = multipleimg;
                }
                req.body.ProductImage = oldData.ProductImage;
                
                req.body.Upadate_Date = new Date().toLocaleString();
                let ad = await product.findByIdAndUpdate(req.body.EditId, req.body);
                if (ad) {
                    console.log("Record & Image Update Succesfully");
                    return res.redirect('/admin/product/view_product');
                }
                else {
                    console.log("Record Not Updated");
                    return res.redirect('/admin/product/view_product');
                }
            }
            else {
                console.log("Record Not Updated");
                return res.redirect('/admin/product/view_product');
            }
        }


        
    }
    catch (error) {
        console.log(error);
        return res.redirect('/admin/product/view_product');
    }
}

module.exports.editimg = (req,res)=>{
    // console.log(req.query.id);
    // console.log(req.query.i);
    // console.log(req.query.img);
    var id = req.query.id;
    var i = req.query.i;
    var img = req.query.img;

    return res.render('uploadimg', {
        id:id,
        i:i,
        img:img
    })

}

module.exports.insert_img = async (req,res)=>{
    // console.log(req.body.id);
    // console.log(req.body.i);
    // console.log(req.body.img);
    // console.log(req.files);
    // console.log(req.body);
     //console.log(req.files.multipleproductimage[0]);
     //console.log(req.files.multipleproductimage[0].filename);
    try {
        // console.log(req.body.img);
         var  productsdata = await product.findById(req.body.id);
         var newimgpath =''
         newimgpath = product.prmulimg+"/"+req.files.multipleproductimage[0].filename;
        
         //console.log(newimgpath);
        var de = productsdata.multipleproductimage.splice(req.body.i,1,newimgpath);
        //console.log(de);
            
          var fullPath =  path.join(__dirname,'..',req.body.img);
          //console.log(fullPath);
          
         // console.log(productsdata);
         await fs.unlinkSync(fullPath);
         var datas = await product.findByIdAndUpdate(req.body.id,productsdata)
        console.log(datas);
         if(datas) {
            console.log("Data Updated Successfully");
              return res.redirect('/admin/product/view_product');
          }
          else {
            console.log("Record Not Updated Successfully");
               return res.redirect('/admin/product/view_product');
          }
  
      }
      catch (err) {
          console.log(err);
          return res.redirect('back');
      }

    

}
