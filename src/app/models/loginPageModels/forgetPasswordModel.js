const db = require("../../../config/connectDB/connect");

const checkAccount = function (userName, callback) {
  const query = "SELECT * FROM TaiKhoan WHERE ten_tai_khoan = ?";
  db.execute(query, [userName], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn cơ sở dữ liệu:", err.message);
      return callback(err, null);
    }
    // Kiểm tra kết quả
    if (results.length === 0) {
      return callback(null, null);
    }
    callback(null, results[0]);
  });
};

const commitSave = function (userName, password, callback) {
  const query = "UPDATE TaiKhoan SET mat_khau = ? WHERE ten_tai_khoan = ?";
  db.execute(query, [password, userName], (err, results) => {
    if (err) {
      console.error("Lỗi khi cập nhật dữ liệu:", err.message);
      return callback(err, null); // Trả lỗi qua callback
    }
    callback(null, results); // Trả về kết quả cập nhật
  });
};

module.exports = { checkAccount, commitSave };
