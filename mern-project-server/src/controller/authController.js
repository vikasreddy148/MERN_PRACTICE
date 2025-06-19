const jwt = require("jsonwebtoken");
//https://www.uuidgenerator.net/
const secret = "42e816ec-a1b2-4e95-9cdd-24f4480a648a";
const authController = {
  login: (request, response) => {
    //The Body contains user name and password because of the express.json()
    //middleware configured in the server.js
    const { username, password } = request.body;
    if (username === "admin" && password === "admin") {
      const user = {
        name: "john Cena",
        email: "john@gmail.com",
      };
      const token = jwt.sign(user, secret, { expiresIn: "1h" });
      response.cookie("jwtToken", token, {
        httpOnly: true,
        secure: true,
        domain: "localhost",
        path: "/",
      });
      response.json({ user: user, message: "User authenticated" });
    } else {
      response.status(401).json({ message: "Invalid credentails" });
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
