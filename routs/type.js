const express = require('express');
const routs = express.Router();
const typecontroller = require('../controller/typecontroller');
routs.get('/AddType',typecontroller.addType);
routs.get('/isActive/:id',typecontroller.isActive);
routs.get('/deActive/:id',typecontroller.deActive);
routs.post('/insertTypeData',typecontroller.insertType);
routs.post('/getbrands',typecontroller.getbrands);
routs.get('/viewType',typecontroller.viewType);


routs.get('/updatetype/:id',typecontroller.updatetype);
routs.post('/updatetypedata',typecontroller.updatetypedata);
module.exports = routs