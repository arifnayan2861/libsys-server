const jwt = require("jsonwebtoken");

const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  secure: process.env.NODE_ENV === "production" ? true : false,
};

const generateToken = async (req, res) => {
  try {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "3h",
    });

    res.cookie("token", token, cookieOptions);
    res.send({ success: true });
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).send({ message: "Failed to generate token" });
  }
};

const logout = async (req, res) => {
  try {
    res
      .clearCookie("token", { ...cookieOptions, maxAge: 0 })
      .send({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).send({ message: "Failed to logout" });
  }
};

module.exports = { generateToken, logout };
