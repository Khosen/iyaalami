const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const propertySchema = mongoose.Schema({
    // _id: Schema.Types.ObjectId,
    type: {
        type: String,
        trim: true
    },
   
    date: {
        type: Date,
        //default: true
    },
   
    uploadedby:{
        type:String
    }
    

})
var property = module.exports = mongoose.model('propertyType', propertySchema);

module.exports.createUser = function(newProperty, callback) {
    newProperty.save(callback);
}