const reportModel = require("../models/reportModel.js");

const renderReport = function (req, res) {
  res.render("report", { layout: "dashboard" });
};

const listRevenue = function (req, res) {
  const month = req.query.month;
  const year = req.query.year;

  reportModel.getRevenue(month, year, (err, revenueList) => {
    if (err) {
      console.error("Lỗi khi truy vấn danh sách:", err.message);
      return res.status(500).json({ error: "Lỗi khi truy vấn danh sách" });
    }

    if (!revenueList || revenueList.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có dữ liệu cho tháng và năm này." });
    }

    // console.log(revenueList);
    res.status(200).json({ data: revenueList });
  });
};

const listDebt = function (req, res) {
  const month = req.query.month;
  const year = req.query.year;

  reportModel.getDebt(month, year, (err, deptList) => {
    if (err) {
      console.error("Lỗi khi truy vấn danh sách:", err.message);
      return res.status(500).json({ error: "Lỗi khi truy vấn danh sách" });
    }

    if (!deptList || deptList.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có dữ liệu cho tháng và năm này." });
    }

    // console.log(deptList);
    res.status(200).json({ data: deptList });
  });
};

module.exports = { renderReport, listRevenue, listDebt };
