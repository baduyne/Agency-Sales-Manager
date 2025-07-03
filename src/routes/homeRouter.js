const express = require("express");
const homeController = require("../app/controllers/homeController.js");

const router = express.Router();

// Định tuyến
router.get("/home", homeController.renderHome);

module.exports = router;
