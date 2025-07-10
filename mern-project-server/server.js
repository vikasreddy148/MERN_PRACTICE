require('dotenv').config();
const mongoose = require('mongoose');
const express = require("express"); // Include the express module
const paymentRoutes = require('./src/routes/paymentRoutes')
const authRoutes = require("./src/routes/authRoutes");
const linksRoutes = require('./src/routes/linksRoutes');
const userRouutes = require('./src/routes/userRoutes');

const cookieParser = require("cookie-parser");
const cors = require("cors");

mongoose.connect(process.env.MONGO_URI).then(()=>console.log('MongoDB connected')
).catch((error)=>console.log(error));

const app = express(); // Instantiate express app.

app.use((request, response, next) => {
  // Skip json middleware for the webhook endpoint
  if (request.originalUrl.startsWith("/payments/webhook")) {
    return next();
  }

  express.json()(request, response, next);
});
app.use(cookieParser());

const corsOptions = {
  origin: process.env.CLIENT_ENDPOINT,
  credentials: true,
};
app.use(cors(corsOptions ));
app.use("/auth", authRoutes);
app.use('/links',linksRoutes);
app.use('/users',userRouutes);
app.use('/payments',paymentRoutes)
const PORT = 5001;
app.listen(5001, (error) => {
  if (error) {
    console.log("Error starting the server", error);
  } else {
    console.log(`server is running at: http://localhost:${PORT}`);
  }
});
