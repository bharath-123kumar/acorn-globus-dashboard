const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  court: { type: Schema.Types.ObjectId, ref: 'Court' },
  startTime: Date,
  endTime: Date,
  resources: {
    equipment: [{ equipmentId: { type: Schema.Types.ObjectId, ref: 'Equipment' }, qty: Number }],
    coach: { type: Schema.Types.ObjectId, ref: 'Coach', required: false }
  },
  status: { type: String, enum: ['confirmed','cancelled','waitlist'], default: 'confirmed' },
  pricingBreakdown: Schema.Types.Mixed
});

module.exports = mongoose.model('Booking', BookingSchema);
