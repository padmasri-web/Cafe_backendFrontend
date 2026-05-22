const Admin = require("../models/admin");
const MenuItem = require("../models/menuitem");
const normalizeText = require("../utils/normalizeText");

exports.createMenuItem = async (req, res) => {
    try {
        const { adminId, name, category, price, description, isVeg, imageUrl } =
            req.body;

        if (!adminId || !name || !category || price === undefined) {
            return res.status(400).json({
                success: false,
                message: "adminId, name, category and price are required",
            });
        }

        const admin = await Admin.findById(adminId);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin/restaurant not found",
            });
        }

        const menuItem = await MenuItem.create({
            admin: adminId,
            name,
            normalizedName: normalizeText(name),
            category,
            price,
            description,
            isVeg,
            imageUrl,
        });

        res.status(201).json({
            success: true,
            message: "Menu item created successfully",
            menuItem,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getAdminMenuItems = async (req, res) => {
    try {
        const { adminId } = req.params;

        const menuItems = await MenuItem.find({ admin: adminId }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            count: menuItems.length,
            menuItems,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getPublicMenuItems = async (req, res) => {
    try {
        const { restoId } = req.params;

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

        const menuItems = await MenuItem.find({
            admin: admin._id,
            isAvailable: true,
        }).sort({ category: 1, name: 1 });

        res.status(200).json({
            success: true,
            restaurant: {
                _id: admin._id,
                restaurantName: admin.restaurantName,
                restoId: admin.restoId,
                upiId: admin.upiId,
            },
            count: menuItems.length,
            menuItems,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.updateMenuItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { adminId, name, category, price, description, isVeg, imageUrl } =
            req.body;

        if (!adminId) {
            return res.status(400).json({
                success: false,
                message: "adminId is required",
            });
        }

        const updates = {};

        if (name !== undefined) {
            updates.name = name;
            updates.normalizedName = normalizeText(name);
        }

        if (category !== undefined) updates.category = category;
        if (price !== undefined) updates.price = price;
        if (description !== undefined) updates.description = description;
        if (isVeg !== undefined) updates.isVeg = isVeg;
        if (imageUrl !== undefined) updates.imageUrl = imageUrl;

        const menuItem = await MenuItem.findOneAndUpdate(
            {
                _id: itemId,
                admin: adminId,
            },
            updates,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found or admin mismatch",
            });
        }

        res.status(200).json({
            success: true,
            message: "Menu item updated successfully",
            menuItem,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.deleteMenuItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { adminId } = req.body;

        if (!adminId) {
            return res.status(400).json({
                success: false,
                message: "adminId is required",
            });
        }

        const menuItem = await MenuItem.findOneAndDelete({
            _id: itemId,
            admin: adminId,
        });

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found or admin mismatch",
            });
        }

        res.status(200).json({
            success: true,
            message: "Menu item deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.toggleMenuItemAvailability = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { adminId } = req.body;

        if (!adminId) {
            return res.status(400).json({
                success: false,
                message: "adminId is required",
            });
        }

        const menuItem = await MenuItem.findOne({
            _id: itemId,
            admin: adminId,
        });

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found or admin mismatch",
            });
        }

        menuItem.isAvailable = !menuItem.isAvailable;
        await menuItem.save();

        res.status(200).json({
            success: true,
            message: "Menu item availability updated successfully",
            menuItem,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};