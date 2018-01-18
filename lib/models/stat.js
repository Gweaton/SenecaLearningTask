let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let StatSchema = new Schema({
  userId: { type: String, required: true },
  courseId: { type: String, required: true },
  total: { type: Number, required: true },
  timeStudied: { type: Number, required: true }
});

module.exports = mongoose.model('stat', StatSchema);
