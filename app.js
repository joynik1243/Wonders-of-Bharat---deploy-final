if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

// console.log(process.env.CLOUDINARY_API_KEY);
// console.log(process.env.CLOUDINARY_API_SECRET);

const express = require("express");
const app= express();
const path= require("path");
const mongoose= require("mongoose");
const ejsMate= require("ejs-mate");
const methodOverride = require("method-override");
const tourSpotsRouter = require("./router/tourSpotsRouter");
const reviewRouter = require("./router/reviewRouter");
const userRouter = require("./router/userRouter");



const flash = require("connect-flash");
// Passport package for authentication
const LocalStrategy = require("passport-local");
const passport = require("passport");
const User = require("./model/user");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

const dbUrl = process.env.MONGODB_URL;
// const dbUrl= "mongodb://localhost:27017/WondersOfBharat";

const {images} = require("./public/homeImages");




mongoose.connect(dbUrl, {
}).then(()=>{
    console.log("Database Connected");
}).catch((error)=>{
    console.log("There is an Error connecting to Database ", error);
});


app.engine('ejs', ejsMate); 
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));


app.use(helmet({ contentSecurityPolicy: false}));
app.use(mongoSanitize());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));


// Note: I am using version 3.0.0 of connect-session. because the latest version has different setup and is constantly giving errors
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);  // for storing session data of users on the mongo atlas

const store = new MongoStore({
    // url: dbUrl,          // Not working with version 3 of connect-mongo
    mongooseConnection: mongoose.connection,  // this is working with connect-mongo version 3. Let it be this way
    secret: process.env.SESSION_SECRET,
    touchAfter: 24*60*60,
});

store.on("error", function(e){
    console.log("Session Store Error: ", e);
})

app.use(session({
    store,
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}));

app.use(flash());

// Configuring passport package for User authentication
app.use(passport.initialize());
app.use(passport.session());  // this must be used after the session middleware is configured

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Middleware to directly send flash messages to the ejs template by 
// putting the flash message in res.locals by the name of success i.e., res.locals.success
app.use((req, res, next)=>{
    
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.reviewSuccess = req.flash("reviewSuccess");
    res.locals.reviewError = req.flash("reviewError");
    res.locals.currentUser = req.user;
    // if(req.user){
    //     console.log(req.user.id);
    // }
    next();
})

app.get("/", (req, res)=>{
    res.render("home", {images});
})

app.use("/tourSpots", tourSpotsRouter);

app.use("/tourSpots/:id/reviews", reviewRouter);

app.use("/", userRouter);

 



// app.all("*", (req, res, next)=>{          // this keeps trigering error even when the routes are visited
//     next(new ExpressError("Page Not Found", 404));
// })


app.use((err, req, res, next)=>{
    const { statusCode= 500} = err;
    if(!err.message) err.message= "Ohh Boy! Something Went Wrong."
    // console.log("Error:");
    res.status(statusCode).render("error.ejs", {err});
})

const port = process.env.PORT || 8000;

app.listen(port, ()=>{
    console.log("Serving on Port 8000");
})