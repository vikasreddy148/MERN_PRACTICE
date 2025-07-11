const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
const Users = require("../model/Users");
const attemotToRefreshToken = async (refreshToken) => {
  try {
    console.log("Attempting to refresh token");
    console.log(refreshToken);
    console.log(refreshSecret);
    console.log(secret);
    console.log("--------------------------------");
    const decoded = jwt.verify(refreshToken, refreshSecret);
    //Fetch the latest user data from the database as across 7 days of refresh token, lifecycle, user details like credits, subscription, etc. can change
    const data = await Users.findById({ _id: decoded.id });
    const user = {
      id: data._id,
      username: data.email,
      name: data.name,
      role: data.role ? data.role : "admin",
      credits: data.credits,
      subscription: data.subscription,
    };
    const newAccessToken = jwt.sign(user, secret, { expiresIn: "1h" });
    return { newAccessToken, user };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
module.exports = { attemotToRefreshToken };
