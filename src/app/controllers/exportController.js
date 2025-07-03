const exportModel = require("../models/exportModel.js");

class exportController {
  async renderExport(req, res) {
    try {
      const stores = await exportModel.getAllStore();
      res.render("export", {
        layout: "dashboard",
        stores: stores[0], // Truyền danh sách đại lý vào view
      });
    } catch (err) {
      console.error("Error fetching stores: ", err);
      res.status(500).send("Error fetching stores");
    }
  }

  async GetInfos(req, res) {
    const StoreID = req.query.id;
    if (!StoreID) {
      return res.status(400).json({ error: "Mã cửa hàng không hợp lệ." });
    }

    try {
      const StoreResult = await exportModel.get_infos(StoreID);
      // Tách các tập kết quả
      const items = StoreResult[0];
      const [debt] = StoreResult[1];
      const [rule] = StoreResult[2];

      // Định dạng dữ liệu trả về
      const responseData = {
        items,
        debt: debt?.tong_no || 0,
        rule: rule || {},
      };

      // Gửi dữ liệu JSON đến client
      return res.json(responseData);
    } catch (err) {
      console.error("Lỗi khi xử lý :", err);
      res.status(500).json({ error: "Lỗi server." });
    }
  }

  async createExport(req, res) {
    const { maDaiLy, ngayLapPhieu, Products } = req.body;

    if (
      !maDaiLy ||
      !ngayLapPhieu ||
      !Array.isArray(Products) ||
      Products.length === 0
    ) {
      return res.status(400).json({ error: "Dữ liệu không hợp lệ" });
    }

    try {
      // Tạo phiếu xuất
      let maPhieuXuat = await exportModel.createExport(
        maDaiLy,
        ngayLapPhieu,
        0
      );

      let totalAmount = 0;

      // Duyệt qua từng sản phẩm để tạo chi tiết phiếu xuất
      for (const product of Products) {
        const { maHangHoa, soLuong } = product;

        // Lấy giá sản phẩm
        const priceResult = await exportModel.getProductPrice(maHangHoa);
        const donGia = priceResult[0]?.don_gia || 0;
        const thanhTien = soLuong * donGia;

        // Tính tổng tiền
        totalAmount += thanhTien;

        // Tạo chi tiết phiếu xuất
        await exportModel.createExportDetails(
          maPhieuXuat,
          maHangHoa,
          soLuong,
          thanhTien
        );
      }

      // Cập nhật tổng tiền vào phiếu xuất
      await exportModel.updateTotalAmount(maPhieuXuat, totalAmount);

      return res.json({ message: "Tạo phiếu xuất thành công.", maPhieuXuat });
    } catch (err) {
      console.error("Lỗi khi tạo phiếu xuất:", err);
      return res.status(500).json({ error: "Lỗi server khi tạo phiếu xuất" });
    }
  }
}

module.exports = new exportController();
