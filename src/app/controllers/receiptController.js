const e = require("express");
const {
  getAgency,
  getDealerInfoByName,
  getAllReceipts,
  createReceipt,
  updateDealerInfo,
} = require("../models/receiptModel.js");

// Hàm hiển thị giao diện "receipt"
const renderReceipt = function (req, res) {
  const stores = getAgency((err, stores) => {
    if (err) {
      console.error("Lỗi khi truy vấn dữ liệu:", err.message);
      return res.status(500).send("Lỗi khi truy vấn dữ liệu");
    }
    res.render("receipt", { layout: "dashboard", stores: stores[0] });
  });
};

// Hàm xử lý yêu cầu tìm thông tin đại lý
const getDealerInfoHandler = (req, res) => {
  const dealerName = req.query.dealerName;

  console.log("Nhận dealerName từ query:", dealerName);

  if (!dealerName || dealerName.trim() === "") {
    console.error("Tên đại lý không hợp lệ");
    return res.status(400).json({ error: "Tên đại lý không hợp lệ" });
  }

  getDealerInfoByName(dealerName, (err, dealerInfo) => {
    if (err) {
      console.error("Lỗi khi truy vấn dữ liệu:", err.message);
      return res.status(500).json({ error: "Lỗi khi truy vấn dữ liệu" });
    }

    if (!dealerInfo) {
      console.error(`Không tìm thấy đại lý: ${dealerName}`);
      return res.status(404).json({ error: "Không tìm thấy đại lý" });
    }

    console.log("Thông tin đại lý trả về:", dealerInfo);
    return res.status(200).json(dealerInfo);
  });
};

const getTableReceipt = async (req, res) => {
  try {
    console.log("Vào hàm getTableReceipt");

    // Lấy dữ liệu từ model (getAllReceipts) và đợi kết quả
    const data = await getAllReceipts();

    // Trả dữ liệu về dưới dạng JSON
    res.status(200).json(data);

    console.log("Trả về dữ liệu");
  } catch (err) {
    // Xử lý lỗi nếu có
    console.error("Lỗi khi truy vấn dữ liệu:", err.message);
    res
      .status(500)
      .json({ message: "Lỗi khi truy vấn dữ liệu từ bảng PhieuThuTien" });
  }
};

const post_receipt = async (req, res) => {
  const { ma_phieu_thu_tien, ma_dai_ly, ngay_lap_phieu, so_tien_thu } =
    req.body;

  console.log("mã phiếu thu tiền ở post receipt:", ma_phieu_thu_tien);

  // Kiểm tra xem các trường có hợp lệ không
  if (!ma_phieu_thu_tien || !ma_dai_ly || !ngay_lap_phieu || !so_tien_thu) {
    return res.status(400).json({ message: "Thông tin yêu cầu không đầy đủ" });
  }

  // Gọi hàm createReceipt
  createReceipt(
    { ma_phieu_thu_tien, ma_dai_ly, ngay_lap_phieu, so_tien_thu },
    (err, result) => {
      if (err) {
        console.error("Lỗi khi lưu phiếu thu:", err.message);
        return res.status(500).json({ message: "Lỗi khi lưu phiếu thu tiền" });
      }

      // Trả về kết quả thành công
      res.status(201).json({
        message: "Phiếu thu tiền đã được tạo thành công",
        data: result,
      });
    }
  );
};

const put_update_debt_dealer = (req, res) => {
  const dealerId = req.query.dealerId; // Lấy dealerName từ tham số đường dẫn
  const { debt } = req.body; // Lấy tổng nợ từ thân yêu cầu

  console.log("vào hàm trừ nợ midwrare");
  console.log(`Nhận PUT cho đại lý: ${dealerId} với tổng nợ: ${debt}`);

  // Kiểm tra xem dealerName và debt có tồn tại không
  if (!dealerId || debt === undefined) {
    return res
      .status(400)
      .json({ message: "Thiếu thông tin đại lý hoặc tổng nợ" });
  }

  // Giả sử updateDealerInfo là một hàm cập nhật thông tin đại lý trong cơ sở dữ liệu
  updateDealerInfo(dealerId, debt, (updateErr, updateResult) => {
    if (updateErr) {
      console.error(
        `Lỗi khi cập nhật thông tin đại lý ${dealerId}: ${updateErr.message}`
      );
      return res
        .status(500)
        .json({ error: "Lỗi khi cập nhật thông tin đại lý" });
    }

    console.log(`Cập nhật thành công cho đại lý: ${dealerId}`);
    return res
      .status(200)
      .json({ message: "Cập nhật thành công", data: updateResult });
  });
};

module.exports = {
  renderReceipt,
  getDealerInfoHandler,
  getTableReceipt,
  post_receipt,
  put_update_debt_dealer,
};
