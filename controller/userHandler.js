const User = require("../model/user");
const tourSpots = require("../model/tourSpots");

module.exports = {
    renderRegisterUserPage(req, res){
        return res.render("./users/register", { pageTitle:"Register"});
    },

    async registerUser(req, res, next){
        // console.log(req.session);
        try{
            const {email, username, firstname, lastname, password} = req.body;
            const user = new User({firstname, lastname, username, email});
            const newUser = await User.register(user, password);
            // console.log(newUser);
            req.login(newUser, err =>{
                if(err){
                    return next(err);
                }
                req.flash("success", "User Successfully Registered. Welcome Aboard!");
                return res.redirect("/tourSpots");
            })
    
        } catch(e){
            req.flash("error", e.message);
            return res.redirect("/register");
        }
    },

    renderLoginPage(req, res){
        // console.log(req.session);
        const returnTo = req.session.returnTo;
        const loginImage = require("../public/loginImage");
        res.render("./users/login", {returnTo, loginImage, pageTitle: "User Login"});
    },

    loginUser(req, res){
        // console.log(req.session);
        req.flash("success", "Welcome Aboard"); 
        const returnTo = req.body.returnTo || "/tourSpots";
        res.redirect(returnTo);
    },

    logoutUser(req, res){
        // console.log(req.session);
        if(req.isAuthenticated()){
            req.logout(function(err){
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("/tourSpots");
                }
                req.flash("success", "You are Logged Out");
                return res.redirect("/tourSpots");
            }); 
        }
    },

    async renderMyPosts(req, res){
        // console.log(req.user);
        // console.log("user _id: ", req.user._id);
        // console.log("user id: ", req.user.id);
        const allSpots = await tourSpots.find({author: req.user._id});
        console.log(allSpots);

        res.render("./users/myPosts", {allSpots, pageTitle: "My Posts"})

    }
}