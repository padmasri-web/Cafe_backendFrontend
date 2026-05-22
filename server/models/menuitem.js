const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
    {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        normalizedName: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        isVeg: {
            type: Boolean,
            default: true,
        },

        isAvailable: {
            type: Boolean,
            default: true,
        },

        imageUrl: {
            type: String,
            default: "",
            trim: true,
        },
    },
    { timestamps: true }
);

menuItemSchema.index({ admin: 1, normalizedName: 1 });
menuItemSchema.index({ admin: 1, category: 1 });

module.exports = mongoose.model("MenuItem", menuItemSchema);