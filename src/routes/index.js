const express = require("express");
const Routes = express.Router();
const { authenticateToken } = require("../middleware/jwt-token-verification");

const validationMiddleware = require("../middleware/validation-middleware");

const users = require("./users");
const myinvestments = require("./myinvestments");
const investor = require("./investor");
const authController = require("../controllers/auth.contoller");
const mediaManager = require("../routes/mediaManager");
const documents = require("./documents");
const roles = require("./roles");
const { profile, changePassword } = require("../controllers/user.controller");
const permissions = require("../controllers/permissions.controller");
/** Home Route */
Routes.get("/", function (req, res) {
  res.send("Home api page");
});

/**Login Route */
Routes.post("/login", validationMiddleware.login, authController.login);

/**Register Route */
Routes.post("/register", validationMiddleware.signup, authController.register);

/**Logout Route */
Routes.post("/logout", authenticateToken, authController.logout);

/** Routes Users  */
Routes.use("/users", authenticateToken, users);

Routes.get("/profile", authenticateToken, profile);

/** Change Password */
Routes.patch(
  "/change-password",
  validationMiddleware.changePassword,
  authenticateToken,
  changePassword
);

/** Routes Users  */
Routes.use("/my-investments", authenticateToken, myinvestments);

/** Investor Routes */
Routes.use("/investors", authenticateToken, investor);

/** Media Manager */
Routes.use("/media-manager", authenticateToken, mediaManager);

/** Documents */
Routes.use("/documents", authenticateToken, documents);

/** Role Routes */
Routes.use("/roles", authenticateToken, roles);

/**Permissions Routes */
Routes.get("/permissions", authenticateToken, permissions.index);


module.exports = Routes;
