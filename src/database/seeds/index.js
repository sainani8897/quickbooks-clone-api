const User = require("../Models/User");
const bcrypt = require("bcrypt");
const { connectDb } = require("../../config/database");
const { Permission, Role } = require("../Models");

const seedUser = {
  name: "Admin",
  email: "admin@gmail.com",
  first_name: "Super",
  last_name: "Owner",
  phone_number: "9000152046",
  password: bcrypt.hashSync("Admin@123", 10),
};

const permissionSeed = [
  {
    name: "create_docs",
    display_text: "Create Docs",
  },
  {
    name: "read_docs",
    display_text: "Read Docs",
  },
  {
    name: "update_docs",
    display_text: "Update Docs",
  },
  {
    name: "delete_docs",
    display_text: "Delete Docs",
  },
  {
    name: "create_media",
    display_text: "Create Media",
  },
  {
    name: "update_media",
    display_text: "Update Media",
  },
  {
    name: "delete_media",
    display_text: "Delete Media",
  },
];

const permissionSeeder = async () => {
  await Permission.deleteMany({});
  await Permission.insertMany(permissionSeed);
  // console.log(permissions);

  const superAdmin = await Role.findOneAndUpdate(
    { name: "super_admin" },
    { name: "super_admin", display_text: "Super Admin" },
    { upsert: true }
  );

  const permissions = await Permission.find({});

  if (permissions) {
    superAdmin.permissions = permissions;
     
    const user = await User.findOneAndUpdate(
      { email: seedUser.email },
      seedUser,
      { upsert: true }
    );
    user.roles = [superAdmin._id];
    await user.save();
  }

  return true;
};

async function userAdd(role) {}

const seedDB = async () => {
  await connectDb();
  const role = await permissionSeeder();
};

seedDB().then(() => {
  console.log("Database seed completed");
  process.exit();
});
