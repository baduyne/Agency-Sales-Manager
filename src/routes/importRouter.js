const express = require("express");
const importController = require("../app/controllers/importController.js");

const router = express.Router();

// Định tuyến
router.post("/import/api", importController.handleImport);
router.get("/import", importController.index);

module.exports = router;
