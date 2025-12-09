const mongoose = require('mongoose');

module.exports = async function connectDB(){
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/acorn_globus';
  try{
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  }catch(err){
    console.error(err);
    process.exit(1);
  }
}
