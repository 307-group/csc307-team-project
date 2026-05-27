// auth.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./models/user.js";

function generateAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) reject(error);
        else resolve(token);
      },
    );
  });
}

export async function registerUser(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .send("Bad request: name, email, and password are required.");
  }
  if (password.length < 6) {
    return res.status(400).send("Password must be at least 6 characters.");
  }

  try {
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).send("An account with that email already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      hashedPassword,
    });
    const saved = await newUser.save();

    const token = await generateAccessToken({
      userId: saved._id,
      email: saved.email,
    });
    res.status(201).send({
      token,
      user: {
        id: saved._id,
        name: saved.name,
        email: saved.email,
        createdAt: saved.createdAt.getTime(),
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error during registration.");
  }
}

export async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .send("Bad request: email and password are required.");
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).send("Incorrect email or password.");
    }

    const matched = await bcrypt.compare(password, user.hashedPassword);
    if (!matched) {
      return res.status(401).send("Incorrect email or password.");
    }

    const token = await generateAccessToken({
      userId: user._id,
      email: user.email,
    });
    res.status(200).send({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.getTime(),
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error during login.");
  }
}

export function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Auth header received:", Boolean(req.headers.authorization));

  if (!token) {
    console.log("No token received");
    return res.status(401).end();
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
    if (decoded) {
      req.user = decoded; // { userId, email }
      next();
    } else {
      console.log("JWT error:", error);
      res.status(401).end();
    }
  });
}
