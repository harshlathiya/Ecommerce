const mongoose = require('mongoose');
const ScateSchema = mongoose.Schema({
    scateName :{
        type : String,
        required : true
    },
    category :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
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
const Scategory = mongoose.model('Scategory',ScateSchema);
module.exports=Scategory;