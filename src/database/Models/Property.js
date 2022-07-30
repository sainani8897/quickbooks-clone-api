const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    property_name: {
      type: String,
      required: true,
    },
    entity_name: {
      type: String,
    },
    address: {
      type: String,
    },
    property_type: {
      type: String,
    },
    units: {
      type: String,
    },
    year_built: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    close_date: {
      type: String,
    },
    expected_hold_period: {
      type: String,
    },
    zipcode: {
      type: Number,
    },
    distribution_frequency: {
      type: String,
    },
    distribution_month: {
      type: Date,
    },
    investment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investment",
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

const Property = mongoose.model("Property", PropertySchema);

module.exports = Property;
