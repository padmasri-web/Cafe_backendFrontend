const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
    {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },

        tableNumber: {
            type: Number,
            required: true,
        },

        tableToken: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        qrCodeUrl: {
            type: String,
            required: true,
            trim: true,
        },

        qrCodeImage: {
            type: String,
            default: "",
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

tableSchema.index({ admin: 1, tableNumber: 1 }, { unique: true });

module.exports = mongoose.model("Table", tableSchema);