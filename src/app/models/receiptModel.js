const db = require("../../config/connectDB/connect.js");

// truy vấn danh sách đại lý
const getAgency = function (callback) {
  const query = `CALL GetAllDaiLy()`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn cơ sở dữ liệu:", err.message);
      return callback(err, null);
    }

    // console.log("Dữ liệu nhận được từ db.query:", results);
    callback(null, results);
  });
};

const getDealerInfoByName = function (dealerName, callback) {
  try {
    // Kiểm tra dealerName hợp lệ
    if (
      !dealerName ||
      typeof dealerName !== "string" ||
      dealerName.trim() === ""
    ) {
      console.error("Tên đại lý không hợp lệ");
      return callback(new Error("Tên đại lý không hợp lệ"), null);
    }

    const cleanDealerName = dealerName.trim(); // Xóa khoảng trắng thừa

    console.log("Đang tìm đại lý...");

    const query = "SELECT * FROM daiLy WHERE ten_dai_ly = ? LIMIT 1";

    // Thực hiện truy vấn cơ sở dữ liệu
    db.execute(query, [cleanDealerName], (err, results) => {
      if (err) {
        console.error("Lỗi khi truy vấn cơ sở dữ liệu:", err.message);
        return callback(err, null);
      }

      console.log("Đã truy vấn cơ sở dữ liệu");
      console.log("Kết quả từ db.execute:", results);

      // Kiểm tra nếu không tìm thấy đại lý
      if (results.length === 0) {
        console.log("Không tìm thấy đại lý.");
        return callback(null, null);
      }

      // Trả về thông tin của đại lý đầu tiên
      console.log("Thông tin đại lý nhận được:", results[0]);
      return callback(null, results[0]);
    });
  } catch (err) {
    console.error("Lỗi khi thực hiện truy vấn:", err.message);
    return callback(err, null);
  }
};

const getAllReceipts = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM PhieuThuTien"; // Truy vấn lấy toàn bộ dữ liệu từ bảng

    db.execute(query, (err, results) => {
      if (err) {
        console.error("Lỗi khi truy vấn cơ sở dữ liệu:", err.message);
        return reject(err); // Trả lỗi nếu có
      }
      resolve(results); // Trả kết quả về khi truy vấn thành công
    });
  });
};

// Hàm tạo phiếu thu tiền
// Hàm xử lý lưu dữ liệu
const createReceipt = (data, callback) => {
  let { ma_phieu_thu_tien, ma_dai_ly, ngay_lap_phieu, so_tien_thu } = data;

  console.log("Dữ liệu để lưu:", {
    ma_phieu_thu_tien,
    ma_dai_ly,
    ngay_lap_phieu,
    so_tien_thu,
  });

  const query = `
    INSERT INTO PhieuThuTien (ma_phieu_thu_tien, ma_dai_ly, ngay_lap_phieu, so_tien_thu)
    VALUES (?, ?, ?, ?)
  `;

  // Thực hiện truy vấn cơ sở dữ liệu
  db.execute(
    query,
    [ma_phieu_thu_tien, ma_dai_ly, ngay_lap_phieu, so_tien_thu],
    (err, results) => {
      if (err) {
        console.error("Lỗi khi truy vấn cơ sở dữ liệu:", err.message);
        return callback(err, null); // Gọi callback với lỗi
      }

      console.log("Đã thêm phiếu thu thành công:", results);
      callback(null, results); // Gọi callback với kết quả
    }
  );
};

const updateDealerInfo = (dealerId, debt, callback) => {
  console.log(`Nhận PUT cho đại lý ID: ${dealerId} với tổng nợ: ${debt}`);

  // Kiểm tra xem dealerId và debt có tồn tại không
  if (!dealerId || debt === undefined) {
    return callback(new Error("Thiếu thông tin đại lý hoặc tổng nợ"));
  }

  // Cập nhật tổng nợ cho đại lý trong cơ sở dữ liệu
  const updateQuery = "UPDATE DaiLy SET tong_no = ? WHERE ma_dai_ly = ?";
  db.execute(updateQuery, [debt, dealerId], (updateErr, updateResult) => {
    if (updateErr) {
      console.error(
        `Lỗi khi cập nhật thông tin đại lý ID ${dealerId}: ${updateErr.message}`
      );
      return callback(new Error("Lỗi khi cập nhật thông tin đại lý"));
    }

    console.log(`Cập nhật thành công cho đại lý ID: ${dealerId}`);
    // Trả kết quả thành công qua callback
    return callback(null, updateResult);
  });
};

module.exports = {
  getAgency,
  getDealerInfoByName,
  getAllReceipts,
  createReceipt,
  updateDealerInfo,
};
