const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EquipmentSchema = new Schema({
  name: String,
  total: Number,
  perUnitPrice: Number
});

module.exports = mongoose.model('Equipment', EquipmentSchema);
