const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { UnauthorizedException } = require("../../exceptions");

const AddressSchema = new mongoose.Schema({
  address_line1: String,
  address_line1: String,
  city: String,
  state:String,
  pin:String,
  country:String,
  country_code:String
});

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    tokens: {
      type: Array,
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
    },
    email_verfied:{
      type:Date
    },
    phone_no_verfied:{
      type:Date
    },
    address:{
      type: AddressSchema,
    },
    timezone:{
      type:String
    },
    org_id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  },
  { timestamps: true },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        delete ret.tokens;
      },
    },
  }
);

userSchema.statics.findByLogin = async function ({ email, password }) {
  let user = await this.findOne({
    email,
  }).select([-password]);

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

userSchema.statics.register = async function (register) {
  return await this.create(register, function (err, userInstance) {
    if (err) throw new Error("BROKEN");
    return userInstance;
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
