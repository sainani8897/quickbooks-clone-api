const jwt = require("jsonwebtoken");
const PersonalAccessTokens = require("../database/Models/PersonalAccessToken");
const { UnauthorizedException } = require("../exceptions");

/**
 * get the authorization token from  request and verify
 */
exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  try {
    if (token == null) throw new UnauthorizedException("Unauthoirzed");
    const data = await PersonalAccessTokens.findByToken({ token });
    await data.populate("user").then((user_data) => {
      req.user = user_data.user;
      if (req.user == null) throw new UnauthorizedException("Unauthoirzed");
      req.token = user_data.token;
    });
    next();
  } catch (error) {
    next(error);
  }
};
