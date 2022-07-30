const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { UnauthorizedException } = require("../../exceptions");

const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
    },
    display_text: {
      type: String,
      required: true,
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

permissionSchema.plugin(mongoosePaginate);

const Permission = mongoose.model("Permission", permissionSchema);

module.exports = Permission;
