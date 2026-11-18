import mongoose, { Schema, Types } from "mongoose";
const NotificationSchema = new Schema({ businessId: { type: Types.ObjectId, ref: "Business", required: true }, userId: { type: Types.ObjectId, ref: "User" }, title: { type: String, required: true }, message: String, href: String, read: { type: Boolean, default: false } }, { timestamps: true });
export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
