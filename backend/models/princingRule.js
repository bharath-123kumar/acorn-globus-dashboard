const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PricingRuleSchema = new Schema({
  name: String,
  type: { type: String, enum: ['multiplier','surcharge'], default: 'surcharge' },
  criteria: Schema.Types.Mixed,
  value: Number,
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('PricingRule', PricingRuleSchema);
