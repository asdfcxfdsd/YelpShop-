const mongoose = require('mongoose');
const Review = require('./review'); 
// By default, Mongoose does not include virtuals when you convert a document to JSON. For example, if you pass a document to Express' res.json() function, virtuals will not be included by default. To include virtuals in res.json(), you need to set the toJSON schema option to { virtuals: true }.
const opts = { toJSON: { virtuals: true } };

const Schema = mongoose.Schema;
// Implement thumbnail. 
const ImageSchema = new Schema({
  url: String,
  filename: String
}); 
ImageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_200')
})


const coffeeshopSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    location: String,
    description: String, 
    geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    author: 
      {
        type: Schema.Types.ObjectId, 
        ref: 'User'
      }
    ,
    reviews: [
      {
        type: Schema.Types.ObjectId, 
        ref: 'Review'
      }
    ] 
}, opts)

// Virtual method which helps us to defind What Messages we want to show on our Mapbox. 
coffeeshopSchema.virtual('properties.popUpMarkup').get(function() {
  return `<strong><a href="/coffeeshops/${this._id}">${this.title}</a></strong>
  <p>${this.description.substring(0,20)}...</p>
  ` 
})





// We'll delete all related reviews if we delete one coffeeshop. 
coffeeshopSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    })
  }
})





module.exports = mongoose.model('Coffeeshop', coffeeshopSchema);





