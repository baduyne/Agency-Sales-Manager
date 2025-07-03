const express = require("express");
const router = express.Router();
const forgetController = require("../../app/controllers/loginPageControllers/forgetPasswordController");

// Định tuyến trong login
router.get("/forget-password", forgetController.renderForget);

// Tìm tài khoản cần đổi mật khẩu
router.post("/api/forget-password", forgetController.authForget);

// // Lưu mật khẩu mới
router.post("/api/save-password", forgetController.savePassword);

module.exports = router;
