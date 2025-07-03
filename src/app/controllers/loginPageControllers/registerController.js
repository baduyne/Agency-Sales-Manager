const registerModel = require("../../models/loginPageModels/registerModel");
const bcrypt = require("bcrypt");

const renderRegister = function (req, res) {
  res.render("authRegister");
};

const authRegister = function (req, res) {
  const userName = req.body.userName;
  const password = req.body.password;

  // Mã hóa mật khẩu
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Lỗi mã hóa mật khẩu:", err.message);
      return res.status(500).json({ message: "Lỗi mã hóa mật khẩu" });
    }
    // Kiểm tra nếu người dùng đã tồn tại
    registerModel.findUser(userName, (err, existingUser) => {
      if (err) {
        console.error("Lỗi khi kiểm tra email:", err.message);
        return res.status(500).json({ message: "Lỗi kiểm tra tài khoản" });
      }
      if (existingUser) {
        return res.status(400).json({ message: "Tài khoản đã tồn tại" });
      }
      // Tạo người dùng mới
      registerModel.createUser(userName, hashedPassword, (err) => {
        if (err) {
          console.error("Lỗi khi thêm người dùng:", err.message);
          return res.status(500).json({ message: "Đã xảy ra lỗi khi đăng ký" });
        }
        res.status(201).json({ message: "Đăng ký thành công" });
      });
    });
  });
};

module.exports = { renderRegister, authRegister };
