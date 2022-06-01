const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });

//const db = mongoose.connection;

//user Schema
const userSchema = mongoose.Schema({
    // _id: Schema.Types.ObjectId,
    name: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        trim: true
    }

});
var User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByUsername = function(username, callback) {
    const query = { username: username };
    User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
        bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
            if (err) throw err;
            callback(null, isMatch);
        });
    }
    //}