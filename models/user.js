const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// We only defined email on our schema, and that's because we still got plugin, which could add on our schema a Username by passport-local-mongoose.

const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true,
        unique: true
    }
})

userSchema.plugin(passportLocalMongoose); 
module.exports = mongoose.model('User', userSchema); 

