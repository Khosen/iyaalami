const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const listingSchema = mongoose.Schema({
    // _id: Schema.Types.ObjectId,
    price: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        
        trim: true
    },
    description: {
        type: String,
      
        trim: true
    },
    
    projectName: {
        type: String,
        
        trim: true
    },
    situation: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        trim: true
    },
    features: {
        type: String,
       
        trim: true
    },

    image: [{
        type: String,
        required: true,
        trim: true
    }],
    status: {
        type: String,
        //required: true,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    }, 
    district:{
        type:String,
        trim: true
    },
    slug: { type: String, slug: "district" },

    available:{
        type:String,
        trim:true
    },
    floor:{
        type:String,
        trim:true
    },
    uploadedby:{
        type:String
    },
    propertyType:{
        type:String, 
        trim:true
    },
    title:{
        type:String, 
        trim:true
    },
    fee:{
        type:String,
        trim:true
    },
    soldUnits:{
        type:Number,
        trim:true
    },
    units:{
        type:Number,
        trim:true
    },
    type:{
        type:String,
        trim:true
    },
    criteria:{
        type:String,
        unique:true,
        trim:true
    },
    structure:{
        type:String,
        trim:true
    }

})
var listing = module.exports = mongoose.model('listing', listingSchema);

module.exports.createUser = function(newListing, callback) {
    newListing.save(callback);
}