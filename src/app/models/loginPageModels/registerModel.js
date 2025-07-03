const db = require("../../../config/connectDB/connect.js");

const findUser = function (userName, callback) {
  const query = "SELECT * FROM TaiKhoan WHERE ten_tai_khoan = ?";
  db.query(query, [userName], (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn :", err.message);
      return callback(err, null);
    }
    if (results.length === 0) {
      return callback(null, null);
    }
    callback(null, results[0]);
  });
};

const createUser = function (userName, password, callback) {
  db.query("SELECT * FROM TaiKhoan", (err, rows) => {
    if (err) {
      console.error("Lỗi khi truy vấn danh sách tài khoản:", err.message);
      return callback(err, null);
    }
    const query =
      "INSERT INTO TaiKhoan (ten_tai_khoan, mat_khau) VALUES (?, ?)";
    db.query(query, [userName, password], (err, result) => {
      if (err) {
        console.error("Lỗi khi thêm dữ liệu:", err.message);
        return callback(err, null);
      }
      console.log("Thêm tài khoản thành công");
      callback(null, result);
    });
  });
};

module.exports = { findUser, createUser };
