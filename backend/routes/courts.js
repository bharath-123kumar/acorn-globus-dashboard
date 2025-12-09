const express = require('express');
const router = express.Router();
const Court = require('../models/Court');

router.get('/', async (req,res)=>{ res.json(await Court.find()); });
router.post('/', async (req,res)=>{ const c = new Court(req.body); await c.save(); res.json(c); });

module.exports = router;
