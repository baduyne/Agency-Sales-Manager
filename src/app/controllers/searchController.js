const searchModel = require("../models/searchModel.js");

class searchController {
  async index(req, res) {
    res.render("search", { layout: "dashboard" });
  }

  async rederSearch(req, res) {
    try {
      const searchResult = await searchModel.getSearch();

      if (Array.isArray(searchResult) && Array.isArray(searchResult[0])) {
        const searchData = searchResult[0]; // Lấy phần tử đầu tiên trong mảng
        //console.log('Dữ liệu gửi đến frontend:', searchData);

        // Trả dữ liệu JSON (mảng đại lý)
        return res.json(searchData || { error: "Không có dữ liệu." });
      } else {
        return res.status(500).json({ error: "Dữ liệu trả về không hợp lệ." });
      }
    } catch (err) {
      console.error("Lỗi khi xử lý:", err);
      res.status(500).json({ error: "Lỗi server." });
    }
  }
}

module.exports = new searchController();
