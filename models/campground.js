const mongoose = require('mongoose');
const Review=require('./review');
const User=require('./user');

const { campgroundSchema } = require('../schemas');
const Schema = mongoose.Schema;
const ImageSchema =new Schema({
    url:String,
    filename:String
})
ImageSchema.virtual('thumbnail').get(function(){
   return this.url.replace('/upload','/upload/w_200');
})
const CampgroundSchema = new Schema({
    title: String,
    images:[ImageSchema],
    description:String,
    price: Number,
    description: String,
    author:
        {type:Schema.Types.ObjectId,
          ref:'User',
        }
    ,
    location: String,
    reviews: [
        {type: Schema.Types.ObjectId,
         ref:'Review'
        }
    ]
});
CampgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})
module.exports = mongoose.model('Campground', CampgroundSchema);