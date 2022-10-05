const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const packageSchema = new mongoose.Schema(
    {
        package_slip: {
            type: String,
            required: true,
        },
        sale_date: {
            type: Date,
        },
        package: [{
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            pcs: Number,
        }],
        status: {
            type: String,
            default: 'Package Created',
            required: true,
        },
        package_notes: {
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

packageSchema.plugin(mongoosePaginate);

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;
