const User = require("../Models/User");
const bcrypt = require("bcrypt");
const { connectDb } = require("../../config/database");
const { Permission, Role } = require("../Models");

const seedUser = {
  name: "Admin",
  email: "admin@gmail.com",
  password: bcrypt.hashSync("Admin@123", 10),
};

const permissionSeed = [
  "create_docs",
  "read_docs",
  "update_docs",
  "delete_docs",
  "create_media",
  "read_media",
  "update_media",
  "delete_media",
  "create_media",
  "read_media",
  "update_media",
  "delete_media",
  "create_investments",
  "read_investments",
  "update_investments",
  "delete_investments",
  "create_property",
  "read_property",
  "update_property",
  "delete_property",
];

const permissionSeeder = async () => {
  const permissions = [];
  permissionSeed.forEach(async (element) => {
    let res = await Permission.findOneAndUpdate(
      { name: element },
      {
        name: element,
        display_text: element.toLocaleUpperCase(),
      },
      { upsert: true }
    );

    permissions.push(res);
  });

  const superAdmin = await Role.findOneAndUpdate(
    { name: "super_admin" },
    { name: "super_admin", display_text: "Super Admin" },
    { upsert: true }
  );

  superAdmin.permissions = permissions;
  superAdmin.save();

  return superAdmin;
};

const seedDB = async () => {
  await connectDb();
  const role = await permissionSeeder();
  const user = await User.findOneAndUpdate(
    { email: seedUser.email },
    seedUser,
    { upsert: true }
  );
  user.roles = [role._id];
  user.save();
};

seedDB().then(() => {
  console.log("Database seed completed");
  process.exit()
});
