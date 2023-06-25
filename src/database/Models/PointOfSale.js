const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const pointOfSaleSchema = new mongoose.Schema(
  {
    order_no: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
    },
    sale_date: {
      type: Date,
    },
    shipment_date: {
      type: Date,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    sales_executives: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    sale_details: {
      sub_total: Number,
      discount_amount: Number,
      tax: Number,
      total: Number,
    },
    items: [{
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      rate: String,
      amount: String,
      qty: String

    }],
    status: {
      type: String,
      default: 'Order Created',
      required: true,
    },
    description: {
      type: String,
    },
    customer_notes: {
      type: String
    },
    shipping_notes: {
      type: String
    },
    sales_order:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalesOrder",
   },
    docs: [
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

pointOfSaleSchema.plugin(mongoosePaginate);

const PointOfSale = mongoose.model("PointOfSale", pointOfSaleSchema);

module.exports = PointOfSale;
