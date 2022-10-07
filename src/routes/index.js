const express = require("express");
const Routes = express.Router();
const { authenticateToken } = require("../middleware/jwt-token-verification");

const validationMiddleware = require("../middleware/validation-middleware");

const users = require("./users");
const myinvestments = require("./myinvestments");
const investor = require("./investor");
const customer = require("./customer");

const authController = require("../controllers/auth.contoller");
const mediaManager = require("../routes/mediaManager");
const documents = require("./documents");
const roles = require("./roles");
const vendors = require("./vendor");
const { profile, changePassword } = require("../controllers/user.controller");
const permissions = require("../controllers/permissions.controller");
const category = require("./category");
const tax = require("./tax");
const product = require("./product");
const salesOrder = require("./salesOrders");
const purchaseOrder = require("./purchaseOrder");
const package = require("./package");

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

/* Refresh token  */
Routes.post("/refresh", authController.refreshToken);

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

/** Customers Routes */
Routes.use("/customers", authenticateToken, customer);

Routes.use("/vendors", authenticateToken, vendors);

/** Categories Routes */
Routes.use("/categories", authenticateToken, category);

/** Tax Routes */
Routes.use("/taxes", authenticateToken, tax);

/** Tax Routes */
Routes.use("/products", authenticateToken, product);

/** Sales Order Routes */
Routes.use("/sales-order", authenticateToken, salesOrder);

/** Purchase Order Routes */
Routes.use("/purchase-order", authenticateToken, purchaseOrder);

/** Package Routes */
Routes.use("/packages", authenticateToken, package);


module.exports = Routes;
