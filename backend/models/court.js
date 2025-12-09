const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourtSchema = new Schema({
  name: String,
  type: { type: String, enum: ['indoor','outdoor'], default: 'indoor' },
  basePrice: { type: Number, default: 10 },
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Court', CourtSchema);
