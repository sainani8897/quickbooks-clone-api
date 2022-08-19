const { User } = require("../database/Models");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { NotFoundException } = require("../exceptions");

exports.index = async function (req, res, next) {
  res.send("At Users Controller");
};

exports.show = async function (req, res, next) {
  const slug = req.params.slug;
  try {
    var user = await User.findOne({ name: slug }).select("-password").exec();
    if (user) return res.send(user);
    else throw new NotFoundException("No Data Found!");
  } catch (error) {
    next(error);
  }
};

exports.create = async function (req, res, next) {
  User.create(
    {
      email: req.body.email,
      name: req.body.first_name + " " + req.body.last_name,
      password: bcrypt.hashSync(req.body.password, saltRounds),
    },
    function (err, userInstance) {
      if (err) res.send(err.message);
      res.send(userInstance);
    }
  );
};

exports.profile = async function (req, res, next) {
  return res.send({
    status: 200,
    message: "My Profile",
    data: req.user,
  });
};

exports.changePassword = async function (req, res, next) {
  try {
    const current_password = req.body.current_password;
    const new_password = await bcrypt.hashSync(req.body.new_password, 10);
    const user = req.user;
    const match = await bcrypt.compare(current_password, user.password);

    if (match) {
      user.password = new_password;
      const res = await user.save();
    }

    return res.send({
      status: 200,
      message: "My Profile",
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};
