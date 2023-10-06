import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

import { validate } from "../utils/validation.js";

const userSchema = {
  email: { type: "string" },
  password: { type: "string", range: [4, 12] }
};

export const signup = async (req, res, next) => {
  try {
    const userObj = { email: req.body.email, password: req.body.password };

    const error = validate(userObj, userSchema);
    if (error) {
      return res.status(400).json(error);
    }

    const hash = await bcrypt.hash(req.body.password, 10);
    if (!hash) {
      throw new Error("hash is undefined");
    }

    const user = new User({
      email: userObj.email,
      password: hash
    });

    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ error: "Incorrect login or password" });
    }

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Incorrect login or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION
    });

    res.status(200).json({
      userId: user._id,
      token
    });
  } catch (error) {
    next(error);
  }
};

export default { signup, login };
