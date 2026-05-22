const express = require("express");

const {
    createTable,
    getAdminTables,
    getPublicTable,
    deleteTable,
} = require("../controllers/tableController");

const router = express.Router();

router.post("/", createTable);

router.get("/admin/:adminId", getAdminTables);

router.get("/public/:restoId/:tableToken", getPublicTable);

router.delete("/:tableId", deleteTable);

module.exports = router;