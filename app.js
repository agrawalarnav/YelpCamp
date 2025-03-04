if(process.env.NODE_ENV !=="production"){
    require('dotenv').config()
}
console.log(process.env.secret)
const express=require('express');
const path=require('path');
const app=express();

const mongoose=require('mongoose');
const ejsmate=require('ejs-mate');

const ExpressError=require('./utils/ExpressError');
const Joi=require('joi');
const methodOverride=require('method-override');

const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/user');

const session=require('express-session');
const flash=require('connect-flash');

const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');

mongoose.connect('mongodb://127.0.0.1:27017/yelp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsmate);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

const sessionConfig={
    secret:'thisshouldbeabettersecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true
    }
}
app.use(session(sessionConfig));
 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currentUser=req.user;
    
    next();
})



app.use(express.static(path.join(__dirname,'public')));

app.use('/',userRoutes)
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)

app.listen('3000',()=>{
    console.log("listening at port 3000");
});
 



app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404));
})
app.use((err,req,res,next)=>{
    const {statusCode=500,message='something went wrong'}=err;
     if(!err.message)err.message='oh boy! something went wrong';
    res.status(statusCode).render('error',{err});
    
})