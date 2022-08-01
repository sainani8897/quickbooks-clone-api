const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const AddressSchema = new mongoose.Schema({
  address_line1: String,
  address_line2: String,
  city: String,
  state: String,
  pincode: String,
  latitude: String,
  longitude: String,
});

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
      unique: true,
    },
    company_name: {
      type: String,
    },
    company_email: {
      type: String,
    },
    address: {
      type: AddressSchema,
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
