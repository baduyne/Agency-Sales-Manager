const express = require("express");
const exportController = require("../app/controllers/exportController.js");

const router = express.Router();

// Định tuyến
router.get("/export/api", exportController.GetInfos);

router.post("/api/create-export", exportController.createExport);

router.get("/export", exportController.renderExport);

module.exports = router;
