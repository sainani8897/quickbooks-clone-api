const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const paymentSchema = new mongoose.Schema(
    {
        payment_no: {
            type: String,
            required: true
        },
        reference: {
            type: String,
        },
        payment_date: {
            type: Date,
            default: Date.now()
        },
        invoice: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Invoice",
            required:true
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required:true
        },
        tax: Number,
        deposit_to: String,
        amount: { type: Number, required: true },
        remaining_due: { type: Number, required: true },
        payment_mode: String,
        transaction_details: {
            type: mongoose.Schema.Types.Mixed
        },
        status: {
            type: String,
            default: 'Created',
            required: true,
        },
        notes: {
            type: String,
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

paymentSchema.plugin(mongoosePaginate);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
