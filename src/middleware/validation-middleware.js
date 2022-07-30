const validator = require("../helpers/validate");
const { ValidationException } = require("../exceptions");

exports.signup = (req, res, next) => {
  const validationRule = {
    email: "required|email",
    first_name: "required|string",
    last_name:'required|string',
    password: "required|string|min:6|confirmed",
    question1:"required|string",
    answer1:"required|string",
    question2:"required|string",
    answer2:"required|string",
    question3:"required|string",
    answer3:"required|string",
    phone_number:'required|numeric'
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException("Validation Failed", err);
    } else {
      next();
    }
  });
};

exports.login = (req, res, next) => {
  const validationRule = {
    email: "required|email",
    password: "required",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException("Validation Failed", err);
    } else {
      next();
    }
  });
};

exports.changePassword = (req, res, next) => {
  const validationRule = {
    current_password: "required",
    new_password: "required|string|min:6|confirmed",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException("Validation Failed", err);
    } else {
      next();
    }
  });
};

exports.myInvestments = (req, res, next) => {
  const validationRule = {
    "payload.property_name": "required",
    "payload.inv_entity": "required",
    "payload.portal_url": "required",
    "payload.portal_user_id": "required",
    "payload.portal_password": "required",
    "payload.note": "required",
    "payload.investment_amount": "required",
    "payload.year_1_returns": "required",
    "payload.year_2_returns": "required",
    "payload.year_3_returns": "required",
    "payload.year_4_returns": "required",
    "payload.year_5_returns": "required",
    "payload.irr": "required",
    "payload.investor.name": "required",
    "payload.investor.profile": "required",
    "payload.investor.email": "required|email",
    "payload.investor.phone": "required",
    "payload.investor.address": "required",
    "payload.investor.state": "required",
    "payload.investor.city": "required",
    "payload.investor.zipcode": "required|numeric",
    "payload.property.property_name": "required",
    "payload.property.entity_name": "required",
    "payload.property.address": "required",
    "payload.property.property_type": "required",
    "payload.property.units": "required",
    "payload.property.year_built": "required",
    "payload.property.state": "required",
    "payload.property.city": "required",
    "payload.property.close_date": "required",
    "payload.property.expected_hold_period": "required",
    "payload.property.zipcode": "required",
    "payload.property.distribution_frequency": "required",
    "payload.property.distribution_month": "required",
    "payload.sponsorship.group_name": "required",
    "payload.sponsorship.members": "required|array",
    "payload.sponsorship.members.*.name": "required",
    "payload.sponsorship.members.*.email": "required|email",
    "payload.sponsorship.members.*.phone": "required",
  };

  if (req.method == "PATCH") {
    validationRule["payload._id"] = ["required", "regex:/^[0-9a-fA-F]{24}$/"];
    validationRule["payload.property._id"] = [
      "required",
      "regex:/^[0-9a-fA-F]{24}$/",
    ];
    validationRule["payload.sponsorship._id"] = [
      "required",
      "regex:/^[0-9a-fA-F]{24}$/",
    ];
  }

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException("Validation Failed", err);
    } else {
      next();
    }
  });
};

exports.mediaManager = (req, res, next) => {
  let validationRule = {
    file: "required|files",
    name: "string",
  };

  if (req.method == "DELETE") {
    validationRule = {
      _id: "required|array",
    };
  }

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException("Validation Failed", err);
    } else {
      next();
    }
  });
};

exports.documentRules = (req, res, next) => {
  let validationRule = {
    "payload.name": "required",
    "payload.added_at": "required",
    "payload.files": "required|array",
    "payload.files.*.name": "required",
    "payload.files.*.url": "required|string",
    "payload.files.*._id": "required",
  };

  if (req.method == "DELETE") {
    validationRule = {
      _id: "required|array",
    };
  }

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException("Validation Failed", err);
    } else {
      next();
    }
  });
};

exports.roleRules = (req, res, next) => {
  let validationRule = {
    "payload.name": "required",
    "payload.permissions": "required|array",
  };

  if (req.method == "DELETE") {
    validationRule = {
      _id: "required|array",
    };
  }

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException("Validation Failed", err);
    } else {
      next();
    }
  });
};
