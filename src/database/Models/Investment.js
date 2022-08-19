const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const investmentSchema = new mongoose.Schema(
  {
    property_name: {
      type: String,
      required: true,
    },
    inv_entity: {
      type: String,
    },
    portal_url: {
      type: String,
    },
    portal_user_id: {
      type: String,
    },
    portal_password: {
      type: String,
    },
    sponsorship_group_name: {
      type: String,
    },
    note: {
      type: String,
    },
    investment_amount: {
      type: Number,
    },
    year_1_returns: {
      type: Number,
    },
    year_2_returns: {
      type: Number,
    },
    year_3_returns: {
      type: Number,
    },
    year_4_returns: {
      type: Number,
    },
    year_5_returns: {
      type: Number,
    },
    irr: {
      type: Number,
    },
    investor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investor",
    },
    properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
    sponsorships: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sponsorship",
      },
    ],
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

investmentSchema.plugin(mongoosePaginate);

/*
investmentSchema.statics.paginate = async function (register) {
  var limit = 10;
  var skip = pageNo * (limit - 1);
  var totalCount;

  //count documents
  this.count({}, function (err, count) {
    if (err) {
      totalCount = 0;
    } else {
      totalCount = count;
    }
  });
  if (totalCount == 0) {
    return callback("No Document in Database..", null);
  }
  //get paginated documents
  this.find()
    .skip(skip)
    .limit(limit)
    .exec(function (err, docs) {
      if (err) {
        return callback("Error Occured", null);
      } else if (!docs) {
        return callback("Docs Not Found", null);
      } else {
        var result = {
          totalRecords: totalCount,
          page: pageNo,
          nextPage: pageNo + 1,
          result: docs,
        };
        return callback(null, result);
      }
    });
};
*/

const Investment = mongoose.model("Investment", investmentSchema);

module.exports = Investment;
