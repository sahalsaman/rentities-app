import mongoose, { Schema, Types } from "mongoose";
const ExpenseSchema = new Schema({ businessId: { type: Types.ObjectId, ref: "Business", required: true }, propertyId: { type: Types.ObjectId, ref: "Property" }, title: { type: String, required: true }, amount: { type: Number, required: true }, category: { type: String, default: "Other" }, spentAt: { type: Date, default: Date.now }, note: String, deleted: { type: Boolean, default: false } }, { timestamps: true });
export default mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);
