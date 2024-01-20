const Admin = require('../models/Admin');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

module.exports.addAdmin = (req, res) => {
    return res.render('addAdmin',{
        message: req.flash('message')
    });
}
module.exports.checkemail = async (req, res) => {

    let check = await Admin.findOne({ email: req.body.email })
    if (check) {
        return res.status(200).json({ msg: 'Email alrady  Ragisted....', status: 1 });
    }
    else {
        return res.status(200).json({ msg: '', status: 1 });
    }
}
module.exports.insertAdmin = async (req, res) => {
    try {
        let check = await Admin.findOne({ email: req.body.email })

        if (check) {

            await fs.unlinkSync(req.file.path);
            var errors = 'Email Alrady Exist';
            console.log(errors)

            return res.status(200).json({ msg: 'Email alrady  Ragisted....', status: 1 });



        }
        else {
            if (req.body.password>= 6) {

                adminImagePath = '';
                if (req.file) {
                    adminImagePath = Admin.imgModel + '/' + req.file.filename;
                    if (adminImagePath) {
                        req.body.adminImage = adminImagePath;
                    }
                    else {
                        console.log("Path Not Found");
                    }
                }
                req.body.role="admin"
                req.body.isActive = true;
                req.body.currentDate = new Date().toLocaleString();
                req.body.updateDate = new Date().toLocaleString();
                await Admin.create(req.body);
                req.flash('message', 'Admin Added');
                return res.redirect('back');
                

            }
            else{
                return res.redirect('back');
            }
        }



    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}
module.exports.loginCheck = async (req, res) => {
    return res.redirect('/admin/dashboard');
}
module.exports.viewAdmin = async (req, res) => {
    try {


        var search = "";
        if (req.query.search) {
            search = req.query.search;
        }
        if (req.query.page) {
            page = req.query.page;
        }
        else {
            page = 0;
        }
        var perPage = 40;

        let AdminData = await Admin.find({
            $or: [
                { "name": { $regex: ".*" + search + ".*", $options: "i" } },
                { "email": { $regex: ".*" + search + ".*", $options: "i" } },
                { "gender": { $regex: ".*" + search + ".*", $options: "i" } },
            ]
        }).limit(perPage).skip(perPage * page);
        let totalAdmindata = await Admin.find({
            $or: [
                { "name": { $regex: ".*" + search + ".*", $options: "i" } },
                { "email": { $regex: ".*" + search + ".*", $options: "i" } },
                { "gender": { $regex: ".*" + search + ".*", $options: "i" } },
            ]
        }).countDocuments();
        return res.render('viewAdmin', {
            adminData: AdminData,
            searchValue: search,
            totaldocument: Math.ceil(totalAdmindata / perPage),
            currentPage: page
        })


    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}
module.exports.isActive = async (req, res) => {
    try {
        if (req.params.id) {
            let active = await Admin.findByIdAndUpdate(req.params.id, { isActive: false });
            if (active) {
                console.log("Data Deactive Successfully");
                return res.redirect('back');
            }
            else {
                console.log("Record Not Deactive");
                return res.redirect('back');
            }
        }
        else {
            console.log("Params Id not Found");
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}
module.exports.deActive = async (req, res) => {
    try {
        if (req.params.id) {
            let active = await Admin.findByIdAndUpdate(req.params.id, { isActive: true });
            if (active) {
                console.log("Data Isactive Successfully");
                return res.redirect('back');
            }
            else {
                console.log("Record Not Deactive");
                return res.redirect('back');
            }
        }
        else {
            console.log("Params Id not Found");
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}
module.exports.updateAdmin = async (req, res) => {
    try {
        let adminRecord = await Admin.findById(req.params.id);
        let splitName = adminRecord.name.split(' ');
        if (adminRecord) {
            return res.render('updateAdmin', {
                splitName: splitName,
                AdminData: adminRecord,
            })
        }
        else {
            console.log('Record Not Found');
            return res.redirect('back');
        }
    }
    catch (error) {
        console.log(error);
        return res.redirect('back');
    }
}
module.exports.editAdmin = async (req, res) => {
    try {
        if (req.file) {
            let oldData = await Admin.findById(req.body.EditId);
            // console.log(req.body)
            if (oldData) {
                if (oldData.adminImage) {
                    let fullPath = path.join(__dirname, '..', oldData.adminImage);
                    await fs.unlinkSync(fullPath);
                }
                var adminImagePath = Admin.imgModel + '/' + req.file.filename;
                req.body.adminImage = adminImagePath;

                req.body.updateDate = new Date().toLocaleString();
                let ad = await Admin.findByIdAndUpdate(req.body.EditId, req.body);
                return res.redirect('/admin/product/view_product');
            }
            else {
                console.log("Record Not Updated");
                return res.redirect('/admin/viewAdmin');
            }
        }
        else {
            let oldData = await Admin.findById(req.body.EditId);
            if (oldData) {
                // console.log(req.body);
                req.body.adminImage = oldData.adminImage;

                req.body.updateDate = new Date().toLocaleString();
                let ad = await Admin.findByIdAndUpdate(req.body.EditId, req.body);
                if (ad) {
                    console.log("Record & Image Update Succesfully");
                    return res.redirect('/admin/viewAdmin');
                }
                else {
                    console.log("Record Not Updated");
                    return res.redirect('/admin/viewAdmin');
                }
            }
            else {
                console.log("Record Not Updated");
                return res.redirect('/admin/viewAdmin');
            }
        }
    }
    catch (error) {
        console.log(error);
        return res.redirect('/admin/viewAdmin');
    }
}
module.exports.deletAdmin = async (req, res) => {
    try {
        let oldData = await Admin.findById(req.params.id);
        if (oldData) {
            var oldImage = oldData.adminImage;
            if (oldImage) {
                let fullPath = path.join(__dirname, '..', oldData.adminImage);
                await fs.unlinkSync(fullPath);
                let deletData = await Admin.findByIdAndDelete(req.params.id);
                if (deletData) {
                    console.log("Record & Image Delet Succesfully");
                    return res.redirect('back');
                }
                else {
                    console.log("Record Delet Succesfully");
                    return res.redirect('back');
                }
            }
            else {
                let deletData = await Admin.findByIdAndDelete(req.params.id);
                if (deletData) {
                    console.log("Admin Data Delet");
                    return res.redirect('back');
                }
                else {
                    console.log("Admin Record Delet");
                    return res.redirect('back');
                }
            }
        }
        else {
            console.log("Record Not Found");
            return res.redirect('back');
        }
    }
    catch (error) {
        console.log(error);
        return res.redirect('back');
    }
}
module.exports.sendMail = async (req, res) => {
    try {
        let checkMailData = await Admin.findOne({ email: req.body.email });
        if (checkMailData) {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                    user: "harshlathiya91@gmail.com",
                    pass: "ejlzrfzgkzvcpcpv",
                },
            });
            var OTP = Math.floor(100000 + Math.random() * 900000);
            res.cookie('otp', OTP);
            res.cookie('email', checkMailData.email);
            const info = await transporter.sendMail({
                from: 'harshlathiya91@gmail.com', // sender address
                to: checkMailData.email, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: `<h1>You're Otp is ${OTP}</h1>`, // html body
            });
            if (info) {
                console.log('Otp Sent Succesfully');
                return res.redirect('/admin/verifyOtp');
            }
            else {
                console.log("Email Is Not Valid");
                return res.redirect('back');
            }
        }
        else {
            console.log("Email Not Found");
            return res.redirect('back');
        }
    }
    catch (error) {
        console.log(error);
        return res.redirect('back');
    }
}
module.exports.setNewPassword = async (req, res) => {
    if (req.body.otp == req.cookies.otp) {
        return res.render('ForgotePassword/newPassword');
    }
    else {
        console.log("Otp Not Match");
        return res.redirect('back');
    }
}
module.exports.verifyPass = async (req, res) => {
    if (req.body.password == req.body.cpass) {
        let email = req.cookies.email;
        let checkEmail = await Admin.findOne({ email: email });
        if (checkEmail) {
            let resetPassword = await Admin.findByIdAndUpdate(checkEmail.id, { password: req.body.password });
            if (resetPassword) {
                res.clearCookie('otp');
                res.clearCookie('email');
                return res.redirect('/admin/');
            }
            else {
                console.log("Password Not Changed");
                return res.redirect('back');
            }
        }
        else {
            console.log("Email Not Found");
            return res.redirect('back');
        }
    }
    else {
        console.log("Password Not Matched");
        return res.redirect('back');
    }
}
module.exports.updateProfile = async (req, res) => {
    try {
        let adminRecord = await Admin.findById(req.params.id);

        if (adminRecord) {
            return res.render('updateProfile', {

                AdminData: adminRecord,
            })
        }
        else {
            console.log('Record Not Found');
            return res.redirect('back');
        }
    }
    catch (error) {
        console.log(error);
        return res.redirect('back');
    }
}
module.exports.editProfile = async (req, res) => {
    try {
        if (req.file) {
            let oldData = await Admin.findById(req.body.EditId);
            if (oldData) {
                if (oldData.adminImage) {
                    let fullPath = path.join(__dirname, '..', oldData.adminImage);
                    await fs.unlinkSync(fullPath);
                }
                var adminImagePath = Admin.imgModel + '/' + req.file.filename;
                req.body.adminImage = adminImagePath;

                req.body.updateDate = new Date().toLocaleString();
                let ad = await Admin.findByIdAndUpdate(req.body.EditId, req.body);
                if (ad) {
                    console.log("Record & Image Update Succesfully");
                    return res.redirect('/admin/profile');
                }
                else {
                    console.log("Record Not Updated");
                    return res.redirect('/admin/profile');
                }
            }
            else {
                console.log("Record Not Updated");
                return res.redirect('/admin/profile');
            }
        }
        else {
            let oldData = await Admin.findById(req.body.EditId);
            if (oldData) {
                req.body.adminImage = oldData.adminImage;

                req.body.updateDate = new Date().toLocaleString();
                let ad = await Admin.findByIdAndUpdate(req.body.EditId, req.body);
                if (ad) {
                    console.log("Record & Image Update Succesfully");
                    return res.redirect('/admin/profile');
                }
                else {
                    console.log("Record Not Updated");
                    return res.redirect('/admin/profile');
                }
            }
            else {
                console.log("Record Not Updated");
                return res.redirect('/admin/profile');
            }
        }
    }
    catch (error) {
        console.log(error);
        return res.redirect('/admin/profile');
    }
}
module.exports.changePassword = async (req, res) => {
    try {
        if (req.user == undefined) {
            return res.redirect('/admin/');
        }
        return res.render('changePassword')
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}
module.exports.modifyPassword = async (req, res) => {
    try {
        let oldData = req.user;
        if (oldData) {
            if (oldData.password == req.body.cpass) {
                if (req.body.cpass != req.body.password) {
                    if (req.body.password == req.body.copass) {
                        let oldAdmin = await Admin.findById(oldData._id);
                        if (oldAdmin) {
                            let editPassword = await Admin.findByIdAndUpdate(oldAdmin._id, { 'password': req.body.password });
                            if (editPassword) {
                                return res.redirect('/admin/logout');
                            }
                            else {
                                console.log("Password Not Changed");
                            }
                        }
                        else {
                            console.log("Data Not Found");
                        }
                    }
                    else {
                        console.log("new & confirm Password Not Match");
                    }
                }
                else {
                    console.log("current & New Password Are Same");
                }
            }
            else {
                console.log("Current Password Not Matched");
            }
        }
        else {
            console.log('Data Not Found');
        }
        return res.redirect('back');
    } catch (error) {
        console.log(error);
        return res.redirect('back');
    }
}