const express = require('express');
const routs = express.Router();
const ecatecontroller = require('../controller/ecatecontroller');
routs.get('/addEcate',ecatecontroller.addEcate);
routs.get('/isActive/:id',ecatecontroller.isActive);
routs.get('/deActive/:id',ecatecontroller.deActive);
routs.post('/getsubcat',ecatecontroller.getsubcat);
routs.post('/insertEcategoryData',ecatecontroller.insertEcate);
routs.get('/viewEcate',ecatecontroller.viewEcate);


routs.get('/updateecat/:id',ecatecontroller.updateecat);
routs.post('/updateecatdata',ecatecontroller.updateecatdata);
module.exports = routs;