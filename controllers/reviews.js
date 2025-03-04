const Campground=require('../models/campground');
const Review=require('../models/review');

module.exports.newReview=async(req,res,next)=>{
    const camp=await Campground.findById(req.params.id);
    const review=new Review(req.body.review);
    review.author=req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success','review added successfully');
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.deleteReview=async(req,res,next)=>{
    const {reviewId,id}=await req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','review deleted successfully');
    res.redirect(`/campgrounds/${id}`);
  }