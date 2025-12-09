const express = require('express');
const router = express.Router();
const { createBooking } = require('../controllers/bookingController');
const PricingRule = require('../models/PricingRule');
const Court = require('../models/Court');
const Equipment = require('../models/Equipment');
const Coach = require('../models/Coach');
const { calculatePrice } = require('../utils/pricingEngine');

router.post('/', createBooking);

router.post('/price-preview', async (req,res)=>{
  try{
    const { courtId, startTime, endTime, equipment: eqList, coachId } = req.body;
    const court = await Court.findById(courtId);
    const pricingRules = await PricingRule.find({ enabled: true });
    const equipmentDetails = [];
    if(eqList && eqList.length){
      for(const e of eqList){
        const ed = await Equipment.findById(e.equipmentId);
        equipmentDetails.push({ ...ed.toObject(), qty: e.qty });
      }
    }
    const coach = coachId ? await Coach.findById(coachId) : null;
    const breakdown = await calculatePrice({ basePrice: court.basePrice, start: new Date(startTime), end: new Date(endTime), courtType: court.type, equipment: equipmentDetails, coach, pricingRules });
    res.json(breakdown);
  }catch(e){ res.status(400).json({ error: e.message }); }
});

module.exports = router;
