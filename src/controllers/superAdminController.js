const bcrypt = require("bcrypt");
const { User } = require("../models");

const createSuperAdmin = async (req, res, next) => {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const username = process.env.SUPER_ADMIN_USERNAME;

  if (!email || !password || !username) {
    console.log("Cannot create SuperAdmin: Missing super admin credentials");
    return res.status(400).json({
      success: false,
      message: "Cannot create SuperAdmin: Missing super admin credentials",
    });
  }

  try {
    const existingSuperAdmin = await User.findOne({ where: { email: email } });
    if (existingSuperAdmin) {
      console.log("Super admin already exists");

      return res.status(409).json({
        success: false,
        message: "Super admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hashSync(password, 10);
    const superAdmin = await User.create({
      email: email,
      password: hashedPassword,
      username: username,
      role: "superadmin",
      isVerified: true,
    });

    if (superAdmin) {
      console.log("Super admin created successfully");
      return res.status(200).json({
        success: true,
        message: "Super admin created successfully",
      });
    }
  } catch (error) {
    console.log("Error creating superAdmin: ", error);
    return res.status(500).json({
      success: false,
      message: "Error creating superAdmin: ",
      error,
    });
  }
};

module.exports = {
  createSuperAdmin,
};
