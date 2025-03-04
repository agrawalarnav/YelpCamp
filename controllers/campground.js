const Campground=require('../models/campground');
const {cloudinary}=require('../cloudinary')

module.exports.index=async(req,res,next)=>{
    const camps=await Campground.find({});
    res.render('campgrounds/index',{camps});
}

module.exports.newFormRender=(req,res)=>{
     res.render('campgrounds/new');
}

module.exports.deleteCampground=async (req,res,next)=>{
    const {id}=req.params;
    
    await Campground.findByIdAndDelete(id);
    req.flash('success','campground deleted successfully');
    res.redirect('/campgrounds');
}

module.exports.editFormRender=async (req,res,next)=>{
    const {id}=req.params;
    const camp= await Campground.findById(id);
    if(!camp){
        req.flash('error','cannot find campground');
        return res.redirect('/campgrounds');
     }
     
    res.render('campgrounds/edit',{camp});
}

module.exports.editCampground=async (req,res,next)=>{
    const {id}=req.params;
    console.log(req.body);
    const img=req.files.map(f=>({filename:f.filename,url:f.path}))
    const camp= await Campground.findByIdAndUpdate(id,{...req.body.campgrounds});
    camp.images.push(...img);
    await camp.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
          await  cloudinary.uploader.destroy(filename);
        }
       await camp.updateOne({$pull:{images:{filename:{$in: req.body.deleteImages}}}});
       console.log(camp);
    }
    req.flash('success','campground updated successfully');
    res.redirect(`/campgrounds/${id}`)
}

module.exports.newCampground=async(req,res,next)=>{
   
        
     const camp=new Campground(req.body.campgrounds);
     camp.images=req.files.map(f=>({url:f.path,filename:f.filename}));
     camp.author=req.user._id;

     await camp.save();
     console.log(camp);
     req.flash('success','campground saved successfully')
     res.redirect(`/campgrounds/${camp._id}`);
    
}

module.exports.showCampground=async(req,res,next)=>{
    const camp=await Campground.findById(req.params.id).populate({path:'reviews',populate:{path:'author'}}).populate('author');
    console.log(camp);
    if(!camp){
       req.flash('error','cannot find campground');
       return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{camp});
}