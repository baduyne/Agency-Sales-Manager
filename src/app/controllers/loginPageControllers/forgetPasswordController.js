const forgetModel = require("../../models/loginPageModels/forgetPasswordModel"); // Import model
const bcrypt = require("bcrypt");

//render giao dien
const renderForget = function (req, res) {
  res.render("forgetPassword");
};

const authForget = function (req, res) {
  const userName = req.body.nameAccountFind;
  // Gọi hàm checkAccount với callback
  forgetModel.checkAccount(userName, (err, existingUser) => {
    if (err) {
      console.error("Lỗi khi tìm tài khoản:", err);
      return res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi tìm tài khoản" });
    }
    if (existingUser) {
      return res.status(200).json({ message: "Tìm thấy tài khoản" });
    } else {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }
  });
};

const savePassword = function (req, res) {
  const userName = req.body.nameAccountFind;
  const password = req.body.newPasswordValue;
  // Mã hóa mật khẩu
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Lỗi khi mã hóa mật khẩu:", err);
      return res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi mã hóa mật khẩu" });
    }

    // Lưu mật khẩu vào database
    forgetModel.commitSave(userName, hashedPassword, (err, results) => {
      if (err) {
        console.error("Lỗi khi lưu mật khẩu:", err);
        return res
          .status(500)
          .json({ message: "Đã xảy ra lỗi khi lưu mật khẩu" });
      }
      res.status(200).json({ message: "Cập nhật mật khẩu thành công" });
    });
  });
};

module.exports = { renderForget, authForget, savePassword };
