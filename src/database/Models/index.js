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
};

module.exports = models;
