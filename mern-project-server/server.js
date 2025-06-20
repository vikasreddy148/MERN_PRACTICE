const express = require("express"); // Include the express module

const authRoutes = require("./src/routes/authRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express(); // Instantiate express app.

app.use(express.json()); // Middleware to convert json to javascript object
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use("/auth", authRoutes);
const PORT = 5001;
app.listen(5001, (error) => {
  if (error) {
    console.log("Error starting the server", error);
  } else {
    console.log(`server is running at: http://localhost:${PORT}`);
  }
});
