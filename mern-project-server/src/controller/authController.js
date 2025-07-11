const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Users = require("../model/Users");
const { OAuth2Client } = require("google-auth-library");
const { validationResult } = require("express-validator");
const { attemotToRefreshToken } = require("../util/authUtil");
const sendMail = require("../service/emailService");
// https://www.uuidgenerator.net/
const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

const authController = {
  login: async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(401).json({ errors: errors.array() });
      }

      // The body contains username and password because of the express.json()
      // middleware configured in the server.js
      const { username, password } = request.body;

      // Call Database to fetch user by the email
      const data = await Users.findOne({ email: username });
      if (!data) {
        return response.status(401).json({ message: "Invalid credentials " });
      }

      const isMatch = await bcrypt.compare(password, data.password);
      if (!isMatch) {
        return response.status(401).json({ message: "Invalid credentials " });
      }

      const user = {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role ? data.role : "admin",
        adminId: data.adminId,
        credits: data.credits,
        subscription: data.subscription,
      };

      const token = jwt.sign(user, secret, { expiresIn: "1h" });
      response.cookie("jwtToken", token, {
        httpOnly: true,
        secure: true,
        domain: "localhost",
        path: "/",
      });
      const refreshToken = jwt.sign(user, refreshSecret, { expiresIn: "7d" });
      //store it in the database if you want! Storing in DB will make refresh token more secure and you can revoke it if needed by deleting it from the database
      response.cookie("jwtRefreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        domain: "localhost",
        path: "/",
      });
      response.json({ user: user, message: "User authenticated" });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: "Internal server error" });
    }
  },

  logout: (request, response) => {
    response.clearCookie("jwtToken");
    response.json({ message: "Logout successfull" });
  },

  isUserLoggedIn: async (request, response) => {
    const token = request.cookies.jwtToken;

    if (!token) {
      return response.status(401).json({ message: "Unauthorized access" });
    }

    jwt.verify(token, secret, async (error, user) => {
      if (error) {
        const refreshToken = request.cookies?.jwtRefreshToken;
        if (refreshToken) {
          const { newAccessToken, user } = await attemotToRefreshToken(
            refreshToken
          );
          response.cookie("jwtToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            domain: "localhost",
            path: "/",
          });
          console.log("Refresh Token renewed the access token");
          return response.json({
            message: "User is logged in",
            user: user,
          });
        }

        return response.status(401).json({ message: "Unauthorized access" });
      } else {
        const latestUserDetails = await Users.findById({ _id: user.id });
        response.json({
          message: "User is logged in",
          user: latestUserDetails,
        });
      }
    });
  },

  register: async (request, response) => {
    try {
      // Extract attributes from the request body
      const { username, password, name } = request.body;

      // Firstly check if user already exist with the given email
      const data = await Users.findOne({ email: username });
      if (data) {
        return response
          .status(401)
          .json({ message: "Account already exist with given email" });
      }

      // Encrypt the password before saving the record to the database
      const encryptedPassword = await bcrypt.hash(password, 10);

      // Create mongoose model object and set the record values
      const user = new Users({
        email: username,
        password: encryptedPassword,
        name: name,
        role: "admin",
      });
      await user.save();
      const userDetails = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        credits: user.credits,
      };
      const token = jwt.sign(userDetails, secret, { expiresIn: "1h" });

      response.cookie("jwtToken", token, {
        httpOnly: true,
        secure: true,
        domain: "localhost",
        path: "/",
      });
      response.json({ message: "User registered", user: userDetails });
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: "Internal Server Error" });
    }
  },

  googleAuth: async (request, response) => {
    try {
      const { idToken } = request.body;
      if (!idToken) {
        return response.status(401).json({ message: "Invalid request" });
      }

      const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const googleResponse = await googleClient.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = googleResponse.getPayload();
      const { sub: googleId, name, email } = payload;

      let data = await Users.findOne({ email: email });
      if (!data) {
        data = new Users({
          email: email,
          name: name,
          isGoogleUser: true,
          googleId: googleId,
          role: "admin",
        });
        await data.save();
      }

      const user = {
        id: data._id ? data._id : googleId,
        username: email,
        name: name,
        role: data.role ? data.role : "admin", // This is the ensure backward compatibility
        credits: data.credits,
      };

      const token = jwt.sign(user, secret, { expiresIn: "1h" });
      response.cookie("jwtToken", token, {
        httpOnly: true,
        secure: true,
        domain: "localhost",
        path: "/",
      });
      const refreshToken = jwt.sign(user, refreshSecret, { expiresIn: "7d" });
      response.cookie("jwtRefreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        domain: "localhost",
        path: "/",
      });
      response.json({ user: user, message: "User authenticated" });
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: "Internal server error" });
    }
  },

  sendResetPasswordToken: async (request, response) => {
    try {
      const { email } = request.body;
      if (!email) {
        return response.status(400).json({ message: "Email is required" });
      }
      const user = await Users.findOne({ email });
      if (!user) {
        return response.status(404).json({ message: "User not found" });
      }
      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
      user.resetPasswordCode = code;
      user.resetPasswordExpiry = expiry;
      await user.save();
      // Send code via email
      await sendMail(
        email,
        "Your Password Reset Code",
        `Your password reset code is: ${code}. It will expire in 15 minutes.`
      );
      response.json({ message: "Reset code sent to email" });
    } catch (error) {
      console.log(error);
      response.status(500).json({ message: "Internal server error" });
    }
  },

  resetPassword: async (request, response) => {
    try {
      const { email, code, newPassword } = request.body;
      if (!email || !code || !newPassword) {
        return response
          .status(400)
          .json({ message: "All fields are required" });
      }
      const user = await Users.findOne({ email });
      if (!user) {
        return response.status(404).json({ message: "User not found" });
      }
      if (
        !user.resetPasswordCode ||
        !user.resetPasswordExpiry ||
        user.resetPasswordCode !== code ||
        user.resetPasswordExpiry < new Date()
      ) {
        return response
          .status(400)
          .json({ message: "Invalid or expired code" });
      }
      // Hash new password
      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
      user.resetPasswordCode = undefined;
      user.resetPasswordExpiry = undefined;
      await user.save();
      response.json({ message: "Password reset successful" });
    } catch (error) {
      console.log(error);
      response.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = authController;
