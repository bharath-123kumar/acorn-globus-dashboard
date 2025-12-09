const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');

router.get('/', async (req,res)=>{ res.json(await Equipment.find()); });
router.post('/', async (req,res)=>{ const e = new Equipment(req.body); await e.save(); res.json(e); });

module.exports = router;
