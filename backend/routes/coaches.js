const express = require('express');
const router = express.Router();
const Coach = require('../models/Coach');

router.get('/', async (req,res)=>{ res.json(await Coach.find()); });
router.post('/', async (req,res)=>{ const c = new Coach(req.body); await c.save(); res.json(c); });

module.exports = router;
