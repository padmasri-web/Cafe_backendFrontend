const express = require("express");

const {
    createMenuItem,
    getAdminMenuItems,
    getPublicMenuItems,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemAvailability,
} = require("../controllers/menucontroller");

const router = express.Router();

router.post("/", createMenuItem);

router.get("/admin/:adminId", getAdminMenuItems);

router.get("/public/:restoId", getPublicMenuItems);

router.put("/:itemId", updateMenuItem);

router.delete("/:itemId", deleteMenuItem);

router.patch("/:itemId/availability", toggleMenuItemAvailability);

module.exports = router;