const express = require("express");
const { port } = require("./config/config");
const app = express();
const routes = require("./routes");
const models = require("./database/Models");
const { connectDb } = require("./config/database");
const cors = require("cors");

/** CROS */
app.use(cors());

/** Body Parser */
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/** Intilizing the routes here */
app.use("/api/v1", routes);

/** global error handler */
app.use(function (err, req, res, next) {
  /** Our Custom Exceptions Handled Here! */
  if (err.status) {
    return res
      .status(err.status)
      .send({ status: err.status, message: err.message, error: err.error });
  }
  /** Defualt exception is caught here */
  return res
    .status(500)
    .send({ status: 500, message: err.message, error: err });
});

// app.use(function errorHandler (err, req, res, next) {
//   res.status(500)
//   res.send('error', { error: err })
// })

/**
 * Server Starting at Port
 *
 */
connectDb()
  .then(async () => {
    app.listen(port, () => {
      console.log(` Server Started Running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Could not Able to connent to DB! Server not Started!");
  });
