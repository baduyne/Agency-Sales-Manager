const settingModel = require("../models/settingModel");
const renderSetting = function (req, res) {
  res.render("setting", { layout: "dashboard" });
};

const listTypeAgency = function (req, res) {
  settingModel.getTypeAgency((err, listTpye) => {
    if (err) {
      console.error("Lỗi khi truy vấn database", err.message);
      return res.status(500).json({ error: "Lỗi khi truy vấn danh sách" });
    }

    if (!listTpye || listTpye.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có dữ liệu cho bảng loại đại lý" });
    }

    res.status(200).json({ data: listTpye });
  });
};

const updateTypeAgency = function (req, res) {
  const type = req.body;
  console.log(type);
  settingModel.commitChangeType(type, (error, result) => {
    if (error) {
      console.error("Lỗi khi cập nhật dữ liệu:", error);
      return res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi cập nhật dữ liệu", error });
    }

    console.log("Cập nhật thành công:", result);
    return res.status(200).json({ message: "Cập nhật thành công", result });
  });
};

const maxValue = function (req, res) {
  settingModel.getValuemMax((error, valueMax) => {
    if (error) {
      console.error("Lỗi khi truy vấn dữ liệu:", error);
      return res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi truy vấn dữ liệu", error });
    }

    res.status(200).json({ data: valueMax });
  });
};

const updateMaxAgency = function (req, res) {
  const newData = req.body.new;
  const type = req.body.type;
  settingModel.insertRule(newData, type, (error, result) => {
    if (error) {
      console.error("Lỗi khi truy vấn dữ liệu:", error);
      return res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi truy vấn dữ liệu", error });
    }
    res.status(200).json({ message: "Cập nhật thành công", result });
  });
};

module.exports = {
  renderSetting,
  listTypeAgency,
  updateTypeAgency,
  maxValue,
  updateMaxAgency,
};
