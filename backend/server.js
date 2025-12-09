require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/courts', require('./routes/courts'));
app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/coaches', require('./routes/coaches'));
app.use('/api/pricing-rules', require('./routes/pricingRules'));
app.use('/api/bookings', require('./routes/bookings'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
