const SalesOder = require("../database/Models/SalesOrder");
const Product = require("../database/Models/Product");
const { NotFoundException, ValidationException } = require("../exceptions");
const { pluck } = require("../helpers/helperFunctions");
const SalesItemsHistory = require("../database/Models/SalesItemsHistory");

exports.index = async function (req, res, next) {
  try {
    /** Pagination obj  */
    const options = {
      page: req.query.page ?? 1,
      limit: req.query.limit ?? 10,
      sort: { createdAt: -1 },
      populate: ["created_by", "customer_id", "sales_executives", "docs"],
    };

    const query = req.query;
    if (
      typeof req.query._id !== "undefined" &&
      !req.query._id.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return res.send({ status: 404, message: "Not found!" });
    }
    /** Filters added */
    if (req.query?.search && req.query?.search != "") {
      
      options.populate[1] = {
        path: "customer_id",
        match: {
          // $or: [
          //   { name: { $regex: req.query.search } },
          //   { display_name: { $regex: req.query.search } },
          //   { email: { $regex: req.query.search } },
          //   { mobile: { $regex: req.query.search } },
          //   { company_name: { $regex: req.query.search } },
          //   { company_email: { $regex: req.query.search } },
          //   { company_phone: { $regex: req.query.search } },
          //   { alt_email: { $regex: req.query.search } },
          //   { alt_phone: { $regex: req.query.search } },
          //   { pan: { $regex: req.query.search } },
          //   { gst: { $regex: req.query.search } },
          //   { customer_type: { $regex: req.query.search } },
          // ],
        },
      };

      query.$or = [
        { order_no: { $regex: req.query.search } },
        { "customer_id.name": { $regex: req.query.search } },
        { status: { $regex: req.query.search } },
      ];

      query.customer_id = { $ne: null } ;
    }

    if (req.query?.status && Array.isArray(req.query?.status)) {
      query.status = { $in: req.query?.status };
    }
    const products = await SalesOder.paginate(query, options);
    if (products.totalDocs > 0)
      return res.send({ status: 200, message: "Data found", data: products });
    else
      return res.send({
        status: 204,
        message: "No Content found",
        data: products,
      });
  } catch (error) {
    next(error);
  }
};

exports.show = async function (req, res, next) {
  const _id = req.params.id;
  try {
    var product = await SalesOder.findById({ _id });
    if (product)
      return res.send({ status: 200, message: "Data found", data: product });
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
    const items = await Product.find({
      _id: { $in: pluck(payload?.items, "product_id") },
    });
    let saleItems = [];
    if (items) {
      payload?.items.forEach((value, key) => {
        let prod = items.find((search) => {
          return search._id == value.product_id;
        });

        if (!prod) {
          throw new ValidationException(`Product not found!`);
        }

        console.log("this is prod==", prod);
        if (prod.qty < value.qty) {
          throw new ValidationException(
            `The Selected ${prod.name} is Out of stock`
          );
        }
        prod.qty = parseInt(prod.qty - value.qty);
        // prod.save();
        saleItems.push(prod);
      });
    }

    const order = await SalesOder.create({
      order_no: payload.order_no,
      sale_date: payload.sale_date,
      shipment_date: payload.shipment_date,
      customer_id: payload.customer_id,
      sales_executives: payload.sales_executives,
      items: payload.items,
      sale_details: payload.sale_details,
      customer_comments: payload.customer_comments,
      status: payload.status,
      created_by: req.user._id,
      org_id: req.user.org_id,
      reference: payload.reference,
      shipping_notes: payload.shipping_notes,
      customer_notes: payload.notes,
    });

    if (saleItems.length > 0) {
      saleItems.forEach(async (item, key) => {
        await item.save();
      });
    }

    if (payload?.items.length > 0) {
      payload?.items.forEach(async (item, key) => {
        item.sales_order = order._id;
        item.created_by = req.user._id;
        item.org_id = req.user.org_id;
        const saleItemHistory = await SalesItemsHistory.create(item);
      });
    }

    if (Array.isArray(payload.docs)) {
      /** docs */
      payload.docs.forEach((file) => {
        order.docs.push(file);
      });

      (await order).save();
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
    let saleItems = [];
    const items = await Product.find({
      _id: { $in: pluck(payload?.items, "product_id") },
    });

    console.log("items:", items);

    var order = await SalesOder.findById({ _id });
    if (!order)
      return res.send({ status: 404, message: "No data found", data: {} });

    if (items) {
      payload?.items.forEach((value, key) => {
        let prod = items.find((search) => {
          return search._id == value.product_id;
        });

        let orderedItem = order?.items?.find((search) => {
          return search.product_id == value.product_id;
        });

        if (!prod) {
          throw new ValidationException(`Product not found!`);
        }

        if (orderedItem) {
          /** CALCULATE Actual  */
          const actualQty = value.qty - orderedItem.qty;
          // update the new Qty strock
          const renewed_qty = prod.qty - actualQty;
          if (renewed_qty < 0) {
            throw new ValidationException(
              `The Selected ${prod.name} is Out of stock`
            );
          }
          prod.qty = parseInt(renewed_qty);
        } else {
          if (prod.qty < value.qty) {
            throw new ValidationException(
              `The Selected ${prod.name} is Out of stock`
            );
          }
          prod.qty = parseInt(prod.qty - value.qty);
        }
        // prod.save();
        saleItems.push(prod);
      });
    }

    if (typeof _id !== "undefined" && !_id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.send({ status: 404, message: "Not found!" });
    }

    /** Filters added */
    if (req.query?.search && req.query?.search != "") {
      query.$or = [
        { order_no: { $regex: req.query.search } },
        { sale_date: { $regex: req.query.search } },
        { email: { $regex: req.query.search } },
        { mobile: { $regex: req.query.search } },
        { company_name: { $regex: req.query.search } },
        { company_email: { $regex: req.query.search } },
        { company_phone: { $regex: req.query.search } },
        { alt_email: { $regex: req.query.search } },
        { alt_phone: { $regex: req.query.search } },
        { pan: { $regex: req.query.search } },
        { gst: { $regex: req.query.search } },
        { customer_type: { $regex: req.query.search } },
      ];
    }

    if (req.query?.status && Array.isArray(req.query?.status)) {
      query.status = { $in: req.query?.status };
    }

    const result = await order.update({
      order_no: payload.order_no,
      sale_date: payload.sale_date,
      shipment_date: payload.shipment_date,
      customer_id: payload.customer_id,
      sales_executives: payload.sales_executives,
      items: payload.items,
      sale_details: payload.sale_details,
      customer_comments: payload.customer_comments,
      status: payload.status,
      created_by: req.user._id,
      org_id: req.user.org_id,
      reference: payload.reference,
      shipping_notes: payload.shipping_notes,
      customer_notes: payload.notes,
    });

    if (saleItems.length > 0) {
      saleItems.forEach(async (item, key) => {
        await item.save();
      });
    }

    if (payload?.items.length > 0) {
      payload?.items.forEach(async (item, key) => {
        item.sales_order = order._id;
        item.created_by = req.user._id;
        item.org_id = req.user.org_id;
        const saleItemHistory = await SalesItemsHistory.create(item);
      });
    }

    /** Delete  */
    if (Array.isArray(payload.docs)) {
      /** docs */
      order.docs = [];
      payload.docs.forEach((file) => {
        order.docs.push(file);
      });

      await order.save();
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
    const product = await SalesOder.find(
      {
        _id: ids,
      },
      null
    );
    // console.log(vendor);
    if (product.length <= 0) {
      return res.send({
        status: 204,
        message: "No Data found!",
      });
    }

    product.forEach((doc) => {
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
