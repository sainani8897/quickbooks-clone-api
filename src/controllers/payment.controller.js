const Payment = require("../database/Models/Payment");
const Invoice = require("../database/Models/Invoice");
const Bill = require("../database/Models/Bill");
const { NotFoundException, ValidationException } = require("../exceptions");
const e = require("express");

exports.index = async function (req, res, next) {
  try {
    /** Pagination obj  */
    const options = {
      page: req.query.page ?? 1,
      limit: req.query.limit ?? 10,
      sort: { createdAt: -1 },
      populate: ["customer", "payable"],
    };

    const query = req.query;
    if (
      typeof req.query._id !== "undefined" &&
      !req.query._id.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return res.send({ status: 404, message: "Not found!" });
    }
    const payments = await Payment.paginate(query, options);
    if (payments.totalDocs > 0)
      return res.send({ status: 200, message: "Data found", data: payments });
    else
      return res.send({
        status: 204,
        message: "No Content found",
        data: payments,
      });
  } catch (error) {
    next(error);
  }
};

exports.show = async function (req, res, next) {
  const _id = req.params.id;
  try {
    var invoice = await Payment.findById({ _id });
    if (invoice)
      return res.send({ status: 200, message: "Data found", data: invoice });
    else throw new NotFoundException("No Data Found!");
  } catch (error) {
    next(error);
  }
};

exports.create = async function (req, res, next) {
  try {
    /** Basic Form */
    const payload = req.body.payload;
    let invoice;
    if (payload.onModel == "Bill") {
      invoice = await Bill.findOne({ _id: payload.payable });
    } else {
      invoice = await Invoice.findOne({ _id: payload.payable });
    }

    if (!invoice)
      return res
        .status(404)
        .send({ status: 404, message: "Invoice not found!", data: {} });

    const customer = invoice.customer_id;
    const vendor = invoice.vendor_id ?? null;
    /* Get the all the listed payments */
    const paymentSum = await Payment.aggregate([
      { $match: { payable: invoice._id } },
      {
        $group: {
          _id: "$payable",
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    total = paymentSum[0]?.total ?? 0;

    const totalAmount = parseFloat(total) + parseFloat(payload.amount);
    let remaining_due = invoice.sale_details.total - totalAmount;

    /* Calculate the Balance  */
    if (invoice.sale_details.total < totalAmount) {
      throw new ValidationException(
        "Payment amount cannot be greater the payable amount"
      );
    }

    const payment = await Payment.create({
      payment_no: payload.payment_no,
      payment_date: payload.payment_date,
      invoice: payload.invoice,
      customer: customer,
      vendor: vendor,
      amount: payload.amount,
      remaining_due: remaining_due,
      payment_mode: payload.payment_mode,
      payment_type: payload.payment_type,
      deposit_to: payload.deposit_to,
      status: payload.status,
      created_by: req.user._id,
      org_id: req.user.org_id,
      reference: payload.reference,
      payable: payload.payable,
      onModel: payload.onModel,
    });

    if (remaining_due == 0) {
      invoice.status = "Completed";
      invoice.payment = "Paid";
    } else {
      invoice.payment = "Partially Paid";
    }

    await invoice.save();

    if (Array.isArray(payload.files)) {
      /** Files */
      payload.files.forEach((file) => {
        payment.files.push(file);
      });

      (await payment).save();
    }

    return res.send({
      status: 200,
      message: "Created Successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.update = async function (req, res, next) {
  try {
    /** Basic Form */
    const payload = req.body.payload;
    const _id = payload._id;

    if (typeof _id !== "undefined" && !_id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.send({ status: 404, message: "Not found!" });
    }

    var order = await Payment.findById({ _id });
    if (!order)
      return res.send({ status: 404, message: "No data found", data: {} });

    const result = await order.update({
      payment_date: payload.payment_date,
      payment_mode: payload.payment_mode,
      payment_type: payload.payment_type,
      deposit_to: payload.deposit_to,
      status: payload.status,
      notes: payload.notes,
      reference: payload.reference,
      payable: payload.reference,
      onModel: payload.onModel,
    });

    /** Delete  */
    if (Array.isArray(payload.files)) {
      /** Files */
      payload.files.forEach((file) => {
        document.files.push(file);
      });

      (await document).save();
    }

    return res.send({
      status: 200,
      message: "Updated Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async function (req, res, next) {
  try {
    const ids = req.body._id;

    ids.forEach((id) => {
      if (typeof id !== "undefined" && !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.send({ status: 404, message: "Not found!" });
      }
    });

    /** Delete */
    const invoice = await Payment.find(
      {
        _id: ids,
      },
      null
    );
    // console.log(vendor);
    if (invoice.length <= 0) {
      return res.send({
        status: 204,
        message: "No Data found!",
      });
    }

    invoice.forEach((doc) => {
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
