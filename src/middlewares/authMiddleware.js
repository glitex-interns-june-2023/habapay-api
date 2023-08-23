const jwt = require("jsonwebtoken");

const createAccessToken = (user) => {
  return jwt.sign(
    {
      user,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    {
      user,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Missing access token",
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid access token",
      });
    }

    req.user = user;
    next();
  });

}


const ensureAdmin = async (req, res, next) => {
  const { user } = req;
  if (user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only",
    });
  }

  next();
}

const ensureSuperAdmin = async () => {
  const { user } = req;
  if(user.role != 'superadmin') {
    return res.status(403).json({
      success: false,
      message: "Access denied. SuperAdmins only",
    });
  }
  next();
};




module.exports = {
    createAccessToken,
    createRefreshToken,
    authenticateToken,
    ensureAdmin,
    ensureSuperAdmin
};