const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
 
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    sku: {
        type: String,
        required: true,
        unique: true,
      },
    serial_number: {
      type: Number,
      required: true,
    },
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vendors",
      },
    units_of_measurement: {
     type: String,
    },
    qty: {
        type: Number,
        required: true,
     },
    purchased_price: {
        type: Number,
    },
    cost: {
        type: Number,
        required: true,
    },
    sell_price: {
        type: Number,
    },
    status: {
        type: String,
        required: true,
       },
    description: {
        type: String,
      },
    files: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MediaManager",
        },
    ],
    org_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
      },
      created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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

 productSchema.plugin(mongoosePaginate);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
