const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    mobile: {
      type: String,
    },
    company_name: {
      type: String,
      required: true,
    },
    company_email: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    pincode: {
      type: Number,
    },
    latitude: {
      type: Number,
    },
    longitude: {
        type: Number,
      },
    status: {
     type: String,
    },
  },
  { timestamps: true },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
  }
);

/**
 * Pagination
 */

 customerSchema.plugin(mongoosePaginate);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
