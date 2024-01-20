const express = require('express')
const routs = express.Router();
const usercontroller = require('../controller/usercontroller');
const passport = require('passport')


routs.get('/',usercontroller.userhome);
routs.get('/productlist/:cid/:sid/:eid',usercontroller.prolist);
routs.get('/productlistall',usercontroller.productlistall);
routs.get('/productlistallscat/:id',usercontroller.productlistallscat);
routs.get('/prodetails/:id',usercontroller.prodetails);
routs.get('/loginuser',usercontroller.loginuser);
routs.post('/ajaxRangeFilter',usercontroller.ajaxRangeFilter);
routs.post('/ajaxRangeFilter2',usercontroller.ajaxRangeFilter2);
routs.post('/ajaxRangeFilter3',usercontroller.ajaxRangeFilter3);
routs.post('/ajaxBrandFilter',usercontroller.ajaxBrandFilter);
routs.post('/ajaxBrandFilter2',usercontroller.ajaxBrandFilter2);
routs.post('/ajaxBrandFilter3',usercontroller.ajaxBrandFilter3);
routs.post('/userRegister',usercontroller.userRegister);
routs.post('/checkuserLogin',passport.authenticate('user',{failureRedirect:'/loginuser'}),usercontroller.checkuserLogin);



routs.get('/dashbord',passport.checkUserAuthentication,usercontroller.dashbord);


routs.post('/insertCart',passport.checkUserAuthentication,usercontroller.insertCart);
routs.get('/viewcart',passport.checkUserAuthentication,usercontroller.viewcart);
routs.get('/checkout',passport.checkUserAuthentication,usercontroller.checkout);
routs.post('/changeQuantity', passport.checkUserAuthentication ,usercontroller.changeQuantity);
routs.get('/deleteCart/:id', passport.checkUserAuthentication, usercontroller.deleteCart);
routs.post('/payment', passport.checkUserAuthentication, usercontroller.payment);
module.exports = routs;

