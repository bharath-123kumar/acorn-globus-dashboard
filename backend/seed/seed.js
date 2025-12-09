const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Court = require('../models/Court');
const Equipment = require('../models/Equipment');
const Coach = require('../models/Coach');
const PricingRule = require('../models/PricingRule');

async function seed(){
  await connectDB();
  await Court.deleteMany({}); await Equipment.deleteMany({}); await Coach.deleteMany({}); await PricingRule.deleteMany({});

  await Court.insertMany([
    { name: 'Court 1', type: 'indoor', basePrice: 15 },
    { name: 'Court 2', type: 'indoor', basePrice: 15 },
    { name: 'Court 3', type: 'outdoor', basePrice: 10 },
    { name: 'Court 4', type: 'outdoor', basePrice: 10 }
  ]);

  await Equipment.create({ name: 'Racket', total: 10, perUnitPrice: 5 });
  await Equipment.create({ name: 'Shoes', total: 8, perUnitPrice: 3 });

  await Coach.insertMany([
    { name: 'Coach A', hourlyFee: 20, unavailable: [] },
    { name: 'Coach B', hourlyFee: 25, unavailable: [] },
    { name: 'Coach C', hourlyFee: 18, unavailable: [] }
  ]);

  await PricingRule.insertMany([
    { name: 'Peak Hours (18:00-21:00)', type: 'multiplier', criteria: { timeRange: { start: '18:00', end: '21:00' } }, value: 1.5, enabled: true },
    { name: 'Weekend Surcharge', type: 'surcharge', criteria: { dayOfWeek: 'weekend' }, value: 5, enabled: true },
    { name: 'Indoor Premium', type: 'surcharge', criteria: { courtType: 'indoor' }, value: 3, enabled: true }
  ]);

  console.log('Seeded DB');
  process.exit(0);
}

seed();
