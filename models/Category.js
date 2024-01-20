const mongoose = require('mongoose');
const CateSchema = mongoose.Schema({
    cateName :{
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
const Category = mongoose.model('category',CateSchema);
module.exports=Category;