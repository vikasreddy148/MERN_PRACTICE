require('dotenv').config();
const mongoose = require('mongoose');
const express = require("express"); // Include the express module

const authRoutes = require("./src/routes/authRoutes");
const linksRoutes = require('./src/routes/linksRoutes');
const cookieParser = require("cookie-parser");
const cors = require("cors");

mongoose.connect(process.env.MONGO_URI).then(()=>console.log('MongoDB connected')
).catch((error)=>console.log(error));

const app = express(); // Instantiate express app.

app.use(express.json()); // Middleware to convert json to javascript object
app.use(cookieParser());

const corsOptions = {
  origin: process.env.CLIENT_ENDPOINT,
  credentials: true,
};
app.use(cors(corsOptions ));
app.use("/auth", authRoutes);
app.use('/links',linksRoutes);
const PORT = 5001;
app.listen(5001, (error) => {
  if (error) {
    console.log("Error starting the server", error);
  } else {
    console.log(`server is running at: http://localhost:${PORT}`);
  }
});
