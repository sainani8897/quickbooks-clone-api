const Customer = require("../database/Models/Customer");
const { NotFoundException } = require("../exceptions");

//Customers List
exports.index = async function (req, res, next) {
  try {
    /** Pagination obj  */
    const options = {
      page: req.query.page ?? 1,
      limit: req.query.limit ?? 10,
      sort: { date: -1 },
      // populate: ["files", "created_by"],
    };

    const query = req.query;
    if (
      typeof req.query._id !== "undefined" &&
      !req.query._id.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return res.send({ status: 404, message: "Not found!" });
    }
    const customers = await Customer.paginate(query, options);
    if (customers.totalDocs > 0)
      return res.send({ status: 200, message: "Data found", data: customers });
    else
      return res.send({
        status: 204,
        message: "No Content found",
        data: customers,
      });
  } catch (error) {
    next(error);
  }
};

exports.show = async function (req, res, next) {
  const _id = req.params.id;
  try {
    var customer = await Customer.findById({ _id });
    if (customer)
      return res.send({ status: 200, message: "Data found", data: customer });
    else throw new NotFoundException("No Data Found!");
  } catch (error) {
    next(error);
  }
};

exports.create = async function (req, res, next) {
  try {
    /** Basic Form */
    const payload = req.body.payload;
    // console.log(req.body.payload);
    const customer = await Customer.create({
      name: payload.name,
      email: payload.email,
      mobile: payload.mobile,
      company_name: payload.company_name,
      company_email: payload.company_email,
      address: payload.address,
      status: payload.status,
      org_id:req.user.org_id
    });

    return res.send({
      status: 200,
      message: "Created Successfully",
    });
  } catch (error) {
    next(error);
  }
};

//Update Customer

exports.update = async function (req, res, next) {
  try {
    /** Basic Form */
    const payload = req.body.payload;
    const _id = payload._id;
    console.log(_id);
    if (typeof _id !== "undefined" && !_id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.send({ status: 404, message: "Not found!" });
    }

    var customer = await Customer.findById({ _id });
    if (!customer)
      return res.send({ status: 404, message: "No data found", data: {} });

    const result = await customer.update({
      name: payload.name,
      email: payload.email,
      mobile: payload.mobile,
      email: payload.email,
      company_name: payload.company_name,
      company_email: payload.company_email,
      address: payload.address,
      status: payload.status,
      org_id:req.user.org_id
    });

    return res.send({
      status: 200,
      message: "Updated Successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Delete Customer

exports.delete = async function (req, res, next) {
  try {
    const ids = req.body._id;

    ids.forEach((id) => {
      if (typeof id !== "undefined" && !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.send({ status: 404, message: "Not found!" });
      }
    });

    /** Delete */
    const customer = await Customer.find(
      {
        _id: ids,
      },
      null
    );
    // console.log(vendor);
    if (customer.length <= 0) {
      return res.send({
        status: 204,
        message: "No Data found!",
      });
    }

    customer.forEach((doc) => {
      /** Delete File */
      doc.delete();
    });

    return res.send({
      status: 200,
      message: "Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};
