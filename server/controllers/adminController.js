const Admin = require("../models/admin");
const generateRestoId = require("../utils/generateRestoId");

exports.createDemoAdmin = async (req, res) => {
    try {
        const body = req.body || {};

        const { restaurantName, ownerName, email, phone, address, upiId } = body;

        if (!restaurantName || !ownerName || !email) {
            return res.status(400).json({
                success: false,
                message: "restaurantName, ownerName and email are required",
                receivedBody: req.body,
            });
        }

        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Admin already exists with this email",
                admin: existingAdmin,
            });
        }

        let restoId = generateRestoId(restaurantName);

        while (await Admin.findOne({ restoId })) {
            restoId = generateRestoId(restaurantName);
        }

        const admin = await Admin.create({
            restaurantName,
            ownerName,
            email,
            phone,
            address,
            upiId,
            restoId,
        });

        res.status(201).json({
            success: true,
            message: "Demo admin created successfully",
            admin,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getAdminById = async (req, res) => {
    try {
        const { adminId } = req.params;

        const admin = await Admin.findById(adminId);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        res.status(200).json({
            success: true,
            admin,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};