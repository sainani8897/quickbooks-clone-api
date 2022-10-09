const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const shipmentSchema = new mongoose.Schema(
    {
        shipment_no: {
            type: String,
            required: false,
        },
        shipment_date: {
            type: Date,
        },
        status: {
            type: String,
            default: 'Shippment Created',
            required: true,
        },
        sales_order:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "SalesOrder",
        },
        shipping_notes: {
            type: String
        },
        shipping_type: {
            type: String
        },
        tracking_no: {
            type: String
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

shipmentSchema.plugin(mongoosePaginate);

const Shipment = mongoose.model("Shipment", shipmentSchema);

module.exports = Shipment;
