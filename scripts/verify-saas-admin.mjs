import crypto from "crypto";
import mongoose from "mongoose";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const email = "admin@webcos.com";
const password = "123456";
if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not configured.");

await mongoose.connect(process.env.MONGODB_URI);
const user = await mongoose.connection.collection("users").findOne({ $or: [{ username: email }, { email }] });
if (!user) {
  console.log("Admin record not found in the configured database.");
} else {
  const [format, salt, expected] = String(user.password || "").split("$");
  const actual = format === "scrypt" && salt && expected
    ? crypto.scryptSync(password, salt, 64).toString("hex")
    : "";
  console.log(JSON.stringify({
    found: true,
    username: user.username,
    email: user.email,
    role: user.role,
    disabled: user.disabled,
    deleted: user.deleted,
    passwordMatches: Boolean(actual) && crypto.timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expected, "hex")),
  }));
}
await mongoose.disconnect();
