const express = require("express");
const router= express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");

const userHandler = require("../controller/userHandler");
const {isLoggedIn, isLoggedOut} = require("../middleware");

router.route("/register")
.get( isLoggedOut, userHandler.renderRegisterUserPage)
.post( isLoggedOut, catchAsync(userHandler.registerUser));

router.route("/login")
.get( userHandler.renderLoginPage)
// The req.session.returnTo data is not going from get /login to post /login, and i still cant find the reason. So what i have done is instead 
// sent the req.session.returnTo to the login.ejs file from get /login route and from login.ejs, using form data, i sent it further to post /login
// route, where i used it to return the user back to where it came from. Also keep in mind that i have applied the returnTo to only get routes 
// and not post, put, delete routes.
.post( passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), userHandler.loginUser);

router.get("/logout", isLoggedIn, userHandler.logoutUser);

router.get("/myPosts", isLoggedIn, userHandler.renderMyPosts);



module.exports= router;
