const Product = require("../database/Models/Product");
const { NotFoundException } = require("../exceptions");

exports.index = async function (req, res, next) {
  try {
    /** Pagination obj  */
    const options = {
      page: req.query.page ?? 1,
      limit: req.query.limit ?? 10,
      sort: { createdAt: -1 },
      populate: ["created_by", "vendor_id", "category_id"],
    };

    const query = req.query;
    if (
      typeof req.query._id !== "undefined" &&
      !req.query._id.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return res.send({ status: 404, message: "Not found!" });
    }

    if (req.query?.search && req.query?.search != "") {
      query.$or = [
        { name: { $regex: req.query.search } },
        { sku: { $regex: req.query.search } },
      ];
    }

    if (req.query?.status && Array.isArray(req.query?.status)) {
      query.status = { $in: req.query?.status}
    }

    const products = await Product.paginate(query, options);
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
    var product = await Product.findById({ _id });
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

    const slug = payload.name.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
    const product = await Product.create({
      name: payload.name,
      slug: slug,
      sku: payload.sku,
      serial_number: payload.serial_number,
      type: payload.type,
      track_inventory: Boolean(payload.track_inventory) ?? false,
      vendor_id: payload.vendor_id,
      brand: payload.brand ?? null,
      category_id: payload.category_id ?? null,
      dimension_unit: payload.dimension_unit ?? null,
      ean: payload.ean ?? null,
      height: payload.height ?? null,
      isbn: payload.isbn ?? null,
      length: payload.length ?? null,
      manufacturer: payload.manufacturer ?? null,
      serial_number: payload.serial_number ?? null,
      upc: payload.upc ?? null,
      weight_unit: payload.weight_unit ?? null,
      width: payload.width ?? null,
      units_of_measurement: payload.units_of_measurement ?? null,
      is_returnable: Boolean(payload.is_returnable) ?? false,
      units_of_measurement: payload.units_of_measurement ?? null,
      qty: payload.qty,
      purchased_price: payload.purchased_price ?? null,
      cost: payload.cost,
      sell_price: payload.sell_price ?? null,
      status: payload.status,
      description: payload.description ?? null,
      created_by: req.user._id,
      org_id: req.user.org_id,
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

    var product = await Product.findById({ _id });
    if (!product)
      return res.send({ status: 404, message: "No data found", data: {} });
    const slug = payload.name.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
    const result = await product.update({
      name: payload.name,
      slug: slug,
      sku: payload.sku,
      serial_number: payload.serial_number,
      type: payload.type,
      track_inventory: Boolean(payload.track_inventory) ?? false,
      vendor_id: payload.vendor_id,
      brand: payload.brand ?? null,
      category_id: payload.category_id ?? null,
      dimension_unit: payload.dimension_unit ?? null,
      ean: payload.ean ?? null,
      height: payload.height ?? null,
      isbn: payload.isbn ?? null,
      length: payload.length ?? null,
      manufacturer: payload.manufacturer ?? null,
      serial_number: payload.serial_number ?? null,
      upc: payload.upc ?? null,
      weight_unit: payload.weight_unit ?? null,
      width: payload.width ?? null,
      units_of_measurement: payload.units_of_measurement ?? null,
      is_returnable: Boolean(payload.is_returnable) ?? false,
      units_of_measurement: payload.units_of_measurement ?? null,
      qty: payload.qty,
      purchased_price: payload.purchased_price ?? null,
      cost: payload.cost,
      sell_price: payload.sell_price ?? null,
      status: payload.status,
      description: payload.description ?? null,
      created_by: req.user._id,
      org_id: req.user.org_id,
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
    const product = await Product.find(
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
