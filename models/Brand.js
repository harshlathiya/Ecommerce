const mongoose = require('mongoose');
const BrandSchema = mongoose.Schema({
    category :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required : true
    },
    subcategory :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Scategory',
        required : true
    },
    extracategory :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Ecategory',
        required : true
    },
    brandname :{
        type : String,
        required : true
    },
    isActive :{
        type : Boolean,
        required : true
    },
    currentDate :{
        type : String,
        required : true
    },
    updateDate :{
        type : String,
        required : true
    }
});
const Brand = mongoose.model('Brand',BrandSchema);
module.exports=Brand;