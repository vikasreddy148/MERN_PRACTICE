const jwt = require("jsonwebtoken");

const authMiddleware = {
  protect: async (request, response, next) => {
    try {
      const token = request.cookies?.jwtToken;
      if (!token) {
        return response.status(401).json({
          error: "Unauthorized access",
        });
      }

      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        request.user = user;
        next();
      } catch (error) {
        const refreshToken = request.cookies?.jwtRefreshToken;
        if (refreshToken) {
          const { newAccessToken, user } = await attemotToRefreshToken(
            refreshToken
          );
          const isProduction = process.env.NODE_ENV === "production";
          response.cookie("jwtToken", newAccessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax",
            path: "/",
          });
          console.log('Refresh Token renewed the access token')
          return response.json({
            message: "User is logged in",
            user: user,
          });
        }
        return response.status(401).json({
          error: "Unauthorized access",
        });
      }
    } catch (error) {
      console.log(error);
      response.status(500).json({
        error: "Internal server error",
      });
    }
  },
};

module.exports = authMiddleware;
