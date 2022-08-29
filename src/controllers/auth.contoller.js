const { User, PersonalAccessTokens } = require("../database/Models");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const { required_with } = require("validatorjs/src/lang/en");

exports.login = async function (req, res, next) {
  await User.findByLogin(req.body)
    .then((user) => {
      const token = jwt.sign({ data: user._id }, process.env.APP_KEY, {
        expiresIn: "5d",
      });
      user.token = token;
      const personal_token = PersonalAccessTokens.create({
        token,
        user: user._id,
      }).then((data) => {
        user.save();
      });
      res
        .status(200)
        .json({ _id: user._id, name: user.name, email: user.email, token,user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.register = async function (req, res, next) {
  req.body.password = await bcrypt.hashSync(req.body.password, saltRounds)
  req.body.name = req.body.first_name + " " + req.body.last_name 
  user = await User.create(req.body)
    .then((user) => {
      const token = jwt.sign({ data: user }, process.env.APP_KEY, {
        expiresIn: "5d",
      });
      user.token = token;
      const personal_token = PersonalAccessTokens.create({
        token,
        user: user._id,
      }).then((data) => {
        user.save();
      });
      res
        .status(200)
        .json({ _id: user._id, name: user.name, email: user.email, token });
    })
    .catch((err) => {
      next(err);
    });
};

exports.logout = async function (req, res, next) {
  const token = req.token;
  PersonalAccessTokens.findOneAndDelete({ token }, function (err, doc) {
    if (err) next(err);
    else
      res
        .status(200)
        .json({ status: 200, message: "Logged Out Successfully!" });
  });
};
