const express = require("express");
const settingController = require("../app/controllers/settingController.js");

const router = express.Router();

// Định tuyến
router.get("/settings", settingController.renderSetting);

router.get("/settings/api/agency-type", settingController.listTypeAgency);

router.post("/settings/api/agency-type", settingController.updateTypeAgency);

router.get("/settings/api/rule", settingController.maxValue);

router.post("/settings/api/rule", settingController.updateMaxAgency);

module.exports = router;
