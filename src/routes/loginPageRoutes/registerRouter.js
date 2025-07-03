const express = require("express");
const router = express.Router();
const registerController = require("../../app/controllers/loginPageControllers/registerController");

// Định tuyến login
router.get("/register", registerController.renderRegister);

// API
router.post("/api/register", registerController.authRegister);

module.exports = router;
