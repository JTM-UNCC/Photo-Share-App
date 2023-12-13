/* Source:
/  Author: Kwong, S.
/  Accessed: 12/12/2023, 6:23 PM
/  Code: 'activityFeed.jsx'
/  Link to Author: https://github.com/samjkwong
*/

"use strict";
var mongoose = require('mongoose');
var ActShema = new mongoose.Schema({
  type: String, 
  date_time: {type: Date, default: Date.now}, 
  login_name: String, 
  file_name: String, 
  photo_owner_id: String, 
  comment: String,
});
var Act = mongoose.model('Activity', ActShema);
module.exports = Act;
