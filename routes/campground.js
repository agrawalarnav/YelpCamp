const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');

const {isLoggedIn,validateCampground,isAuthor}=require('../middleware')
const campgrounds=require('../controllers/campground')

const {storage}=require('../cloudinary');
const multer=require('multer')
const upload=multer({storage})


router.route('/')
 .get(catchAsync(campgrounds.index))
 .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.newCampground))
 

router.get('/new',isLoggedIn,campgrounds.newFormRender);

router.route('/:id')
 .delete(isLoggedIn,catchAsync(campgrounds.deleteCampground))
 .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campgrounds.editCampground))
 .get(catchAsync(campgrounds.showCampground));

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.editFormRender))

module.exports=router;