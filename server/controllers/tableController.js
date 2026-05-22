const QRCode = require("qrcode");
const Admin = require("../models/admin");
const Table = require("../models/table");
const generateTableToken = require("../utils/generateTableToken");

exports.createTable = async (req, res) => {
    try {
        const { adminId, tableNumber } = req.body;

        if (!adminId || !tableNumber) {
            return res.status(400).json({
                success: false,
                message: "adminId and tableNumber are required",
            });
        }

        const admin = await Admin.findById(adminId);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin/restaurant not found",
            });
        }

        const existingTable = await Table.findOne({
            admin: adminId,
            tableNumber,
        });

        if (existingTable) {
            return res.status(400).json({
                success: false,
                message: "Table number already exists for this restaurant",
            });
        }

        let tableToken = generateTableToken(tableNumber);

        while (await Table.findOne({ tableToken })) {
            tableToken = generateTableToken(tableNumber);
        }

        const qrCodeUrl = `${process.env.CLIENT_URL}/order/${admin.restoId}/${tableToken}`;

        const qrCodeImage = await QRCode.toDataURL(qrCodeUrl);

        const table = await Table.create({
            admin: adminId,
            tableNumber,
            tableToken,
            qrCodeUrl,
            qrCodeImage,
        });

        res.status(201).json({
            success: true,
            message: "Table QR created successfully",
            table,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getAdminTables = async (req, res) => {
    try {
        const { adminId } = req.params;

        const tables = await Table.find({ admin: adminId }).sort({
            tableNumber: 1,
        });

        res.status(200).json({
            success: true,
            count: tables.length,
            tables,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getPublicTable = async (req, res) => {
    try {
        const { restoId, tableToken } = req.params;

        const admin = await Admin.findOne({
            restoId,
            isActive: true,
        });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found",
            });
        }

        const table = await Table.findOne({
            admin: admin._id,
            tableToken,
            isActive: true,
        });

        if (!table) {
            return res.status(404).json({
                success: false,
                message: "Invalid or inactive table QR",
            });
        }

        res.status(200).json({
            success: true,
            restaurant: {
                _id: admin._id,
                restaurantName: admin.restaurantName,
                restoId: admin.restoId,
                upiId: admin.upiId,
            },
            table: {
                _id: table._id,
                tableNumber: table.tableNumber,
                tableToken: table.tableToken,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.deleteTable = async (req, res) => {
    try {
        const { tableId } = req.params;
        const { adminId } = req.body;

        if (!adminId) {
            return res.status(400).json({
                success: false,
                message: "adminId is required",
            });
        }

        const table = await Table.findOneAndDelete({
            _id: tableId,
            admin: adminId,
        });

        if (!table) {
            return res.status(404).json({
                success: false,
                message: "Table not found or admin mismatch",
            });
        }

        res.status(200).json({
            success: true,
            message: "Table deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};