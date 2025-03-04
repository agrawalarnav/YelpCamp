const express=require('express');
const router=express.Router();

const User=require('../models/user');
const catchAsync=require('../utils/catchAsync');
const passport = require('passport');
const {storeReturnTo}=require('../middleware')
const users=require('../controllers/user')

router.route('/register')
 .get(users.renderRegister)
 .post(catchAsync(users.newUser))

router.route('/login')
  .get(users.renderLogin)
  .post(storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.login);

router.get('/logout',users.logout);

module.exports=router;