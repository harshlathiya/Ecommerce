const mongoose = require('mongoose');
const EcateSchema = mongoose.Schema({
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
    ecateName :{
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
const Ecategory = mongoose.model('Ecategory',EcateSchema);
module.exports=Ecategory;