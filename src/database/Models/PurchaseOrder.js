const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const purchaseOrderSchema = new mongoose.Schema(
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
    delivery_date: {
      type: Date,
    },
    shipment_type: {
        type: String,
    },
    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
    sale_details:{
      sub_total:Number,
      discount_amount:Number,
      tax:Number,
      total:Number,
    },
    items: [mongoose.Schema.Types.Mixed],
    status: {
      type: String,
      default: 'Order Created',
      required: true,
    },
    description: {
      type: String,
    },
    customer_notes:{
      type:String
    },
    shipping_notes:{
      type:String
    },
    send_mailto:String,
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

purchaseOrderSchema.plugin(mongoosePaginate);

const PurchaseOrder = mongoose.model("PurchaseOrder", purchaseOrderSchema);

module.exports = PurchaseOrder;
