const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const user = require('../models/user');
const bcrypt = require('bcrypt');


passport.use(new GoogleStrategy({
    clientID: '1035647780616-iioi7ddkv1siej894gi9nanadgmm60jh.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "https://ecommerce-u5mu.onrender.com/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    //console.log(profile);
    let checkemail = await user.findOne({ email: profile.emails[0].value });
    if (checkemail) {
       cb(null,checkemail);
    }
    else{
        var pass = `${profile.emails[0].value}@123`;
        let userdetails ={
            username: profile.displayName,
            email: profile.emails[0].value,
            password : await bcrypt.hash(pass,10),
            role:'user'
        }
        let userdatanew =await user.create(userdetails);
        if(userdatanew){
            return cb(null,userdatanew);
        }
        else{
            return cb(null,false);
        }
    }
  
  }
));


module.exports = GoogleStrategy;
