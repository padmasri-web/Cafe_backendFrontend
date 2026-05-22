const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
        restaurantName: {
            type: String,
            required: true,
            trim: true,
        },

        ownerName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            default: "",
            trim: true,
        },

        restoId: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },

        address: {
            type: String,
            default: "",
            trim: true,
        },

        upiId: {
            type: String,
            default: "",
            trim: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);