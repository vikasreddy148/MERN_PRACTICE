const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const Users = require('../model/Users');
//https://www.uuidgenerator.net/
const secret = "42e816ec-a1b2-4e95-9cdd-24f4480a648a";
const authController = {
  login: async (request, response) => {
    //The Body contains user name and password because of the express.json()
    //middleware configured in the server.js
   try {
     const { username, password } = request.body;

     //
     const data = await Users.findOne({email:username});
     if(!data){
      return response.status(401).json({message : 'Invalid credentials'});
     }

     const isMatch = await bcrypt.compare(password,data.password);
     if(!isMatch){
      return response.status(401).json({message:'invalid credentials'});
     }
     const user ={
      id:data._id,
      name:data.name,
      email:data.email
     };
       const token = jwt.sign(user, secret, { expiresIn: "1h" });
       response.cookie("jwtToken", token, {
         httpOnly: true,
         secure: true,
         domain: "localhost",
         path: "/",
       });
       response.json({ user: user, message: "User authenticated" });
     } 
    catch (error) {
    console.log(error);
    response.status(500).json({error:'Internal server error'});
   }
  },
  logout: (request, response) => {
    response.clearCookie("jwtToken");
    response.json({ message: "Logout Successfull" });
  },
  isUserLoggedIn: (request, response) => {
    const token = request.cookies.jwtToken;
    if (!token) {
      return response.status(401).json({ message: "Unauthorized access" });
    }
    jwt.verify(token, secret, (error, user) => {
      if (error) {
        return response.status(401).json({ message: "Unauthorized access" });
      } else {
        response.json({ message: "User is logged in", user: user });
      }
    });
  },
};
module.exports = authController;
