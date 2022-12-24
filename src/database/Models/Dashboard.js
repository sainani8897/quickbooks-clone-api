const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const dashboardSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true
        },
        type: {
            type: String
        },
        value: {
            type: Object,
            required: true
        },
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

dashboardSchema.plugin(mongoosePaginate);

const Dashbord = mongoose.model("Dashbord", dashboardSchema);

module.exports = Dashbord;
