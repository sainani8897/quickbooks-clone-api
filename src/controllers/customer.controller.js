const Customer = require("../database/Models/Customer");
const { NotFoundException } = require("../exceptions");

exports.create = async function (req, res, next) {
    try {
      /** Basic Form */
      const payload = req.body.payload;
  
     const customer= await Customer.create({
      name : payload.name,
      name : payload.name,
      name : payload.name,
      name : payload.name,
      name : payload.name,


     })
  
      return res.send({
        status: 200,
        message: payload,
      });
    } catch (error) {
      next(error);
    }
};