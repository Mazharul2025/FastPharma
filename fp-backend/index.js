// const dns = require('dns');
// dns.setDefaultResultOrder('ipv4first');


const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const express = require('express');
const app = express();



dotenv.config();
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
 app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  

// middlewares
app.use(cors());
app.use(express.json());


// routes
app.use('/api/products', require('./routes/productRoute'));
app.use("/api/auth", require('./routes/userRoute'));




