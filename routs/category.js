const express = require('express');
const routs = express.Router();
const categoryController = require('../controller/categorycontroller');

routs.get('/addCategory', (req,res)=>{
    return res.render('addCategory');
});
routs.get('/isActive/:id',categoryController.isActive);
routs.get('/deActive/:id',categoryController.deActive);
routs.get('/viewCategory',categoryController.viewCate);
routs.post('/insertCategoryData',categoryController.insertCateData);

routs.post('/updateCategoryData',categoryController.updateCategoryData);
routs.get('/updatecat/:id',categoryController.updatecat);

module.exports = routs