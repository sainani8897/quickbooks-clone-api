const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const receive = new mongoose.Schema(
    {
        receivable_no: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
        },
        receivable: [{
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            ordered_qty: Number,
            received_qty: Number,
        }],
        status: {
            type: String,
            default: 'Created',
            required: true,
        },
        purchase_order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PurchaseOrder",
        },
        additional_notes: {
            type: String
        },
        shipping_notes: {
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

receive.plugin(mongoosePaginate);

const Receivables = mongoose.model("Receivables", receive);

module.exports = Receivables;
