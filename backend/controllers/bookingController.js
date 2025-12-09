const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Court = require('../models/Court');
const Equipment = require('../models/Equipment');
const Coach = require('../models/Coach');
const PricingRule = require('../models/PricingRule');
const { calculatePrice } = require('../utils/pricingEngine');

function overlaps(start, end){
  return {
    $or: [
      { startTime: { $lt: end, $gte: start } },
      { endTime: { $gt: start, $lte: end } },
      { startTime: { $lte: start }, endTime: { $gte: end } }
    ],
    status: 'confirmed'
  }
}

async function checkCourtAvailable(courtId, start, end){
  const existing = await Booking.findOne({ court: courtId, ...overlaps(start,end) });
  return !existing;
}

async function checkCoachAvailable(coachId, start, end){
  if(!coachId) return true;
  const existing = await Booking.findOne({ 'resources.coach': coachId, ...overlaps(start,end) });
  if(existing) return false;
  const coach = await Coach.findById(coachId);
  if(!coach) return false;
  for(const u of coach.unavailable || []){
    if(!(u.end <= start || u.start >= end)) return false;
  }
  return true;
}

async function checkEquipmentAvailable(equipmentList, start, end){
  if(!equipmentList || equipmentList.length===0) return true;
  for(const item of equipmentList){
    const eq = await Equipment.findById(item.equipmentId);
    if(!eq) return false;
    const bookings = await Booking.find({ ...overlaps(start,end), 'resources.equipment.equipmentId': eq._id });
    let reserved = 0;
    for(const b of bookings){
      for(const e of b.resources.equipment || []){
        if(String(e.equipmentId) === String(eq._id)) reserved += e.qty;
      }
    }
    if(reserved + item.qty > eq.total) return false;
  }
  return true;
}

async function createBooking(req,res){
  const session = await mongoose.startSession();
  session.startTransaction();
  try{
    const { courtId, startTime, endTime, equipment, coachId, userId } = req.body;
    const start = new Date(startTime); const end = new Date(endTime);

    const courtFree = await checkCourtAvailable(courtId, start, end);
    if(!courtFree) throw new Error('Court not available');
    const coachFree = await checkCoachAvailable(coachId, start, end);
    if(!coachFree) throw new Error('Coach not available');
    const equipmentFree = await checkEquipmentAvailable(equipment, start, end);
    if(!equipmentFree) throw new Error('Equipment not available');

    const court = await Court.findById(courtId);
    const pricingRules = await PricingRule.find({ enabled: true });
    const equipmentDetails = [];
    for(const it of equipment || []){
      const ed = await Equipment.findById(it.equipmentId);
      equipmentDetails.push({ ...ed.toObject(), qty: it.qty });
    }
    const coach = coachId ? await Coach.findById(coachId) : null;
    const breakdown = await calculatePrice({ basePrice: court.basePrice, start, end, courtType: court.type, equipment: equipmentDetails, coach, pricingRules });

    const booking = new Booking({
      user: userId || null,
      court: courtId,
      startTime: start,
      endTime: end,
      resources: { equipment: (equipment || []), coach: coachId || null },
      pricingBreakdown: breakdown
    });

    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();
    return res.status(201).json(booking);
  }catch(err){
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ error: err.message });
  }
}

module.exports = { createBooking };
