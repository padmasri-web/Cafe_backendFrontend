const express = require("express");

const {
    createDemoAdmin,
    getAdminById,
} = require("../controllers/adminController");

const router = express.Router();

router.post("/create-demo", createDemoAdmin);
router.get("/:adminId", getAdminById);

module.exports = router;