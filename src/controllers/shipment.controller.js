const Shipment = require("../database/Models/Shipment");
const { NotFoundException } = require("../exceptions");

exports.index = async function (req, res, next) {

  try {
    /** Pagination obj  */
    const options = {
      page: req.query.page ?? 1,
      limit: req.query.limit ?? 10,
      sort: { createdAt: -1 },
      populate: ['sales_order']
    };

    const query = req.query;
    if (
      typeof req.query._id !== "undefined" &&
      !req.query._id.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return res.send({ status: 404, message: "Not found!" });
    }
    const shipments = await Shipment.paginate(query, options);
    if (shipments.totalDocs > 0)
      return res.send({ status: 200, message: "Data found", data: shipments });
    else
      return res.send({
        status: 204,
        message: "No Content found",
        data: shipments,
      });
  }
  catch (error) {
    next(error);
  }
};


exports.show = async function (req, res, next) {  
  const _id = req.params.id;
  try {
    var package = await Shipment.findById({ _id });
    if (package)
      return res.send({ status: 200, message: "Data found", data: package });
    else throw new NotFoundException("No Data Found!");
  } catch (error) {
    next(error);
  }
};


exports.create = async function (req, res, next) {
  try {
    /** Basic Form */
    const payload = req.body.payload;
    //  console.log(req.body.payload);
  
    const product = await Shipment.create({
     shipment_no:payload.shipment_no,
     shipment_date:payload.shipment_date,
     status:payload.status,
     sales_order:payload.sales_order,
     tracking_no:payload.tracking_no,
     shipping_notes:payload.shipping_notes,
     shipping_type:payload.shipping_type,
     created_by: req.user._id,
     org_id: req.user.org_id
    });
    
    if (Array.isArray(payload.files)) {
      /** Files */
      payload.files.forEach((file) => {
        product.files.push(file);
      });

      (await product).save();
    }

    return res.send({
      status: 200,
      message: "Created Successfully",
    });
  } catch (error) {
    next(error);
  }
};


exports.update = async function (req, res, next) {
  try {
    /** Basic Form */
    const payload = req.body.payload;
    const _id = payload._id;
    console.log(_id);
    if (typeof _id !== "undefined" && !_id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.send({ status: 404, message: "Not found!" });
    }

    var order = await Shipment.findById({ _id });
    if (!order)
      return res.send({ status: 404, message: "No data found", data: {} });
    const result = await order.update({
        shipment_no:payload.shipment_no,
        shipment_date:payload.shipment_date,
        status:payload.status,
        sales_order:payload.sales_order,
        tracking_no:payload.tracking_no,
        shipping_notes:payload.shipping_notes,
        shipping_type:payload.shipping_type,
        created_by: req.user._id,
        org_id: req.user.org_id
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
    const package = await Shipment.find(
      {
        _id: ids,
      },
      null
    );
    // console.log(vendor);
    if (package.length <= 0) {
      return res.send({
        status: 204,
        message: "No Data found!",
      });
    }

    package.forEach((doc) => {
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