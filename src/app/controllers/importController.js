const importModel = require("../models/importModel.js");

class importControllers {
  async index(req, res) {
    res.render("import", { layout: "dashboard" });
  }
  async handleImport(req, res) {
    const { name, type, SDT, address, dictrict, email } = req.body;

    // Kiểm tra tham số
    if (!name || !type || !address || !SDT || !dictrict || !email) {
      return res.status(400).json({ error: "Thiếu thông tin cần thiết." });
    }
    try {
      const handleConfirm = await importModel.insertAgency(
        name,
        type,
        SDT,
        address,
        dictrict,
        email
      );

      // Kiểm tra kết quả trả về từ model
      if (handleConfirm) {
        return res.json({ message: "Thêm đại lý thành công" });
      } else {
        return res.status(404).json({ error: "Không thể thêm đại lý" });
      }
    } catch (err) {
      return res.status(500).json({ err });
    }
  }
}

module.exports = new importControllers();
