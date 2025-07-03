const express = require("express");
const reportController = require("../app/controllers/reportController.js");

const router = express.Router();

// Định tuyến
router.get("/report", reportController.renderReport);

router.get("/api/list-revenue", reportController.listRevenue);

router.get("/api/list-debt", reportController.listDebt);

module.exports = router;
