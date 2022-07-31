const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { UnauthorizedException } = require("../../exceptions");
const mongoosePaginate = require("mongoose-paginate-v2");

const AddressSchema = new mongoose.Schema({
  address_line1: String,
  address_line2: String,
  city: String,
  state: String,
  pin: String,
  country: String,
  country_code: String,
  latitude: String,
  longitude: String,
});

const VendorSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    display_name: {
      type: String,
      required: true,
    },
    company_name: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      unique: true,
    },
    email_verfied: {
      type: Date,
    },
    phone_no_verfied: {
      type: Date,
    },
    address: {
      type: AddressSchema,
    },
    timezone: {
      type: String,
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

VendorSchema.plugin(mongoosePaginate);

VendorSchema.statics.findByLogin = async function ({ email, password }) {
  let user = await this.findOne({
    email,
  });

  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return user;
    }
  }

  throw new UnauthorizedException(
    "Invalid Login Email & Password do not match!"
  );
};

VendorSchema.statics.register = async function (register) {
  return await this.create(register, function (err, userInstance) {
    if (err) throw new Error("BROKEN");
    return userInstance;
  });
};

const Vendor = mongoose.model("Vendor", VendorSchema);

module.exports = Vendor;
