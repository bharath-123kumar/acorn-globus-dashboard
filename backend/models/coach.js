const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CoachSchema = new Schema({
  name: String,
  hourlyFee: Number,
  unavailable: [{ start: Date, end: Date }],
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Coach', CoachSchema);
