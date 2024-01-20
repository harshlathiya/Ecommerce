const express = require('express');
const routs = express.Router();
const adminController = require('../controller/admincontroller')
const Admin = require('../models/Admin');
const passport = require('passport');

routs.get("/",async (req,res)=>{
    
    if(req.user == undefined){
        return res.render('login');
    }else{
        return res.render('login');
    }
});
routs.post('/logincheck',passport.authenticate('local',{failureRedirect : '/admin/'}),passport.checkAthuntication,adminController.loginCheck);
routs.get('/dashboard', (req,res)=>{
    if(req.user == undefined){
        return res.render('login');
    }
    return res.render('dashboard')
});
routs.get('/addAdmin',passport.checkAthuntication,adminController.addAdmin);
routs.post('/insertAdminData',passport.checkAthuntication,Admin.uploadImage,adminController.insertAdmin);
routs.get('/viewAdmin',passport.checkAthuntication,adminController.viewAdmin);
routs.get('/isActive/:id',passport.checkAthuntication,adminController.isActive);
routs.post('/checkemail',passport.checkAthuntication,adminController.checkemail);
routs.get('/deActive/:id',passport.checkAthuntication,adminController.deActive);
routs.get('/deActive/:id',passport.checkAthuntication,adminController.deActive);
routs.get('/updateAdmin/:id',passport.checkAthuntication,adminController.updateAdmin);
routs.post('/editAdminData',passport.checkAthuntication,Admin.uploadImage,adminController.editAdmin);
routs.get('/deletAdmin/:id',passport.checkAthuntication,adminController.deletAdmin);
routs.get('/logout',(req,res)=>{
    res.clearCookie("harsh");
    if(req.user == undefined){
            return res.redirect('/admin/login');
    }
    return res.redirect('/admin/')
})
routs.get('/checkMail',async(req,res)=>{
    return res.render('ForgotePassword/checkMail');
})
routs.post('/sendMail',adminController.sendMail);
routs.get('/verifyOtp',(req,res)=>{
    return res.render('ForgotePassword/verifyOtp');
})
routs.post('/setNewPass',adminController.setNewPassword)
routs.post('/verifyPass',adminController.verifyPass);
routs.get('/profile',(req,res)=>{
    if(req.user == undefined){
        return res.redirect('/admin/');
    }
    return res.render('Profile');
});
routs.get('/editProfile/:id',adminController.updateProfile);
routs.post('/editProfileData',Admin.uploadImage,adminController.editProfile);
routs.get('/changePassword',adminController.changePassword);
routs.post('/modifyPassword',adminController.modifyPassword);
routs.use('/category',passport.checkAthuntication,require('./category'));
routs.use('/scate',passport.checkAthuntication,require('./scate'));
routs.use('/ecate',passport.checkAthuntication,require('./ecate'));
routs.use('/brand',passport.checkAthuntication,require('./brand'));
routs.use('/type',passport.checkAthuntication,require('./type'));
routs.use('/product',passport.checkAthuntication,require('./product'));
module.exports = routs;