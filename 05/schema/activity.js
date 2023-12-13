"use strict";
/*
 *  Defined the Mongoose Schema and return a Model for an Activity
 */
/* jshint node: true */

var mongoose = require('mongoose');

var activitySchema = new mongoose.Schema({
  type: String, // type of activity performed: 1) 'photo' for photo upload, 2) 'comment' for comment added, 3) 'registration' for registeration, 4) 'login' for login, or 5) 'logout' for logout
  date_time: {type: Date, default: Date.now}, // data and time when the activity was performed
  login_name: String, // username of user who performed the activity
  file_name: String, // name of the file containing the photo (if a photo is involved in this activity)
  photo_owner_id: String, // id of user who owns the photo (if a photo is involved in this activity)
  comment: String, // comment (if comment is involved)
});

// the schema is useless so far
// we need to create a model using it
var Activity = mongoose.model('Activity', activitySchema);

// make this available to our activities in our Node applications
module.exports = Activity;
