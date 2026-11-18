import mongoose, { Schema, Types } from "mongoose";
const ReminderSchema = new Schema({ businessId: { type: Types.ObjectId, ref: "Business", required: true }, propertyId: { type: Types.ObjectId, ref: "Property" }, title: { type: String, required: true }, dueAt: { type: Date, required: true }, note: String, completed: { type: Boolean, default: false } }, { timestamps: true });
export default mongoose.models.Reminder || mongoose.model("Reminder", ReminderSchema);
