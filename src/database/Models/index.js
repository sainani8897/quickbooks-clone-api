const User = require("./User");
const PersonalAccessTokens = require("./PersonalAccessToken");
const Investment = require("./Investment");
const Investor = require("./Investor");
const Property = require("./Property");
const Sponsorship = require("./Sponsorship");
const MediaManager = require("./MediaManager");
const Document = require("./Document");
const Permission = require("./Permission");
const Role = require("./Role");
const Vendor = require("./Vendor");
const Organization = require("./Organization");
const Category = require('./Category');

const models = {
  User,
  PersonalAccessTokens,
  Investment,
  Property,
  Sponsorship,
  MediaManager,
  Document,
  Permission,
  Role,
  Vendor,
  Organization,
  Category
};

module.exports = models;
