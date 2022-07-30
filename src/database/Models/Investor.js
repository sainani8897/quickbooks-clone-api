const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const investorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    zipcode: {
      type: Number,
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

investorSchema.plugin(mongoosePaginate);

const Investor = mongoose.model("Investor", investorSchema);

module.exports = Investor;
