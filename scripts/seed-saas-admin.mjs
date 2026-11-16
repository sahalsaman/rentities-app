import crypto from "crypto";
import mongoose from "mongoose";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());
const email = "admin@webcos.com";
const password = "123456";
const uri = process.env.MONGODB_URI;

if (!uri) throw new Error("MONGODB_URI must be set before seeding the SaaS admin.");

const salt = crypto.randomBytes(16).toString("hex");
const passwordHash = `scrypt$${salt}$${crypto.scryptSync(password, salt, 64).toString("hex")}`;

await mongoose.connect(uri);
const users = mongoose.connection.collection("users");
await users.updateOne(
  { $or: [{ username: email }, { email }] },
  {
    $set: {
      username: email,
      email,
      password: passwordHash,
      firstName: "Webcos",
      lastName: "Admin",
      role: "Admin",
      disabled: false,
      deleted: false,
      otpVerified: true,
    },
    $setOnInsert: { createdAt: new Date() },
  },
  { upsert: true },
);
await mongoose.disconnect();
console.log(`SaaS admin ${email} is ready.`);
