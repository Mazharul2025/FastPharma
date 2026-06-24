const express = require("express");
const userRouter = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

/**
 * =========================
 * REGISTER USER
 * =========================
 */
userRouter.post("/register", async (req, res) => {
  try {
    const { name, mobile, email, password, address } = req.body;

    const existingUser = await userModel.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      mobile,
      email,
      password: hashedPassword,
      address: address || null,
      role: "user",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * LOGIN USER
 * =========================
 */
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * UPDATE ADDRESS (checkout use case)
 * =========================
 */
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

userRouter.put("/address", authMiddleware, async (req, res) => {
  try {
    const { address } = req.body;

    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      { address },
      { new: true }
    );

    res.json({
      message: "Address updated successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = userRouter;