const express = require("express");
const receiptController = require("../app/controllers/receiptController.js");

const router = express.Router();

// Định tuyến
router.get("/receipt", receiptController.renderReceipt);

// lấy thông tin của đại lý
router.get("/dealer", receiptController.getDealerInfoHandler);

// lấy bảng phiếu thu tiền
router.get("/tableReceipt", receiptController.getTableReceipt);

// đẩy vào bảng phiếu thu tiền
router.post("/postreceipt", receiptController.post_receipt);

// cập nhật lại số tiền nợ
router.put("/updatedealer", receiptController.put_update_debt_dealer);

module.exports = router;
