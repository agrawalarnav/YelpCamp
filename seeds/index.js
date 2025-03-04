const mongoose=require('mongoose');
const Campground=require('../models/campground');
const cities=require('./cities');
const {places,descriptors}=require('./seedHelpers');
mongoose.connect('mongodb://127.0.0.1:27017/yelp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample=array=>array[Math.floor(Math.random()*array.length)];
const seedDb=async()=>{
    await Campground.deleteMany({});
for (let i=0;i<50;i++){
    
    const random1000=Math.floor(Math.random()*1000);
    const cost=Math.floor(Math.random()*20)+10;
    const camp=new Campground({
        location:`${cities[random1000].city},${cities[random1000].state}`,
        title:`${sample(descriptors)} ${sample(places)}`,
        price:cost,
        author:'67c32acef7fe086356747393',
        description : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur placeat impedit modi culpa, nulla rerum aliquam repudiandae sint vitae',
        images: [
            {
              url: 'https://res.cloudinary.com/drmwt4yn1/image/upload/v1740947740/yelp/yftw9aaq0y4muc1sykgx.png',
              filename: 'yelp/yftw9aaq0y4muc1sykgx',
              _id: '67c4c11d98cf79f8423d3d0f'
            },
            {
              url: 'https://res.cloudinary.com/drmwt4yn1/image/upload/v1740947740/yelp/ndlpzrdvmofossdoc28z.png',
              filename: 'yelp/ndlpzrdvmofossdoc28z',
              _id: '67c4c11d98cf79f8423d3d10'
            }
          ]
    })
    await camp.save();
}
}
seedDb()
.then(()=>{
mongoose.connection.close();
})
