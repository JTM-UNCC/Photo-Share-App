"use strict";
/*
 *  Defined the Mongoose Schema and return a Model for an Activity
 */
/* jshint node: true */

var mongoose = require('mongoose');

// create a schema
var activitySchema = new mongoose.Schema({    
    date_time: {type: Date, default: Date.now},
    activity: String,
    photo_file_name: String,
    user_id: mongoose.Schema.Types.ObjectId, // ID of user who performed activity
    photo_user_id: mongoose.Schema.Types.ObjectId, // ID of user to whom photo belongs
    comment_id: mongoose.Schema.Types.ObjectId // ID of comment (if this activity is a comment)
});

// the schema is useless so far
// we need to create a model using it
var Activity = mongoose.model('Activity', activitySchema);

// make this available to our users in our Node applications
module.exports = Activity;
