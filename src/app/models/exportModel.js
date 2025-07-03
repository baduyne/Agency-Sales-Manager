const db = require("../../config/connectDB/connect");

class exportModel {
  static getAllStore() {
    return new Promise((resolve, reject) => {
      const query = `CALL GetAllDaiLy()`;
      db.query(query, (err, results) => {
        if (err) {
          console.error("Lỗi SQL khi lọc đại lý:", err);
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  static get_infos(StoreID) {
    return new Promise((resolve, reject) => {
      const query = `CALL GetAllInfos(${db.escape(StoreID)})`;
      db.query(query, (err, results) => {
        if (err) {
          console.error("Lỗi SQL khi lọc đại lý:", err);
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  static createExport(maDaiLy, ngayLap, tongTien) {
    return new Promise((resolve, reject) => {
      // Bước 1: Gọi stored procedure để tạo phiếu xuất
      const query1 = `CALL CreatePhieuXuatHang(?, ?, ?, @maPhieuXuat);`;

      // Bước 2: Lấy giá trị biến @maPhieuXuat
      const query2 = `SELECT @maPhieuXuat AS maPhieuXuat;`;

      db.query(query1, [maDaiLy, ngayLap, tongTien], (err, results) => {
        if (err) {
          console.error("Lỗi SQL tạo phiếu xuất:", err);
          return reject(err);
        }

        // Sau khi thực hiện query1, thực hiện query2 để lấy giá trị @maPhieuXuat
        db.query(query2, (err2, results2) => {
          if (err2) {
            console.error("Lỗi khi truy vấn @maPhieuXuat:", err2);
            return reject(err2);
          }

          const maPhieuXuat = results2[0]?.maPhieuXuat;
          if (!maPhieuXuat) {
            return reject(new Error("Không thể lấy mã phiếu xuất."));
          }

          resolve(maPhieuXuat);
        });
      });
    });
  }

  // Hàm tạo chi tiết phiếu xuất
  static async createExportDetails(maPhieuXuat, maHangHoa, soLuong, donGia) {
    return new Promise((resolve, reject) => {
      const query = `CALL CreateChiTietPhieuXuatHang(${db.escape(
        maPhieuXuat
      )}, ${db.escape(maHangHoa)}, ${db.escape(soLuong)}, ${db.escape(
        donGia
      )})`;
      db.query(query, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  // Lấy giá của một sản phẩm
  static getProductPrice(maHangHoa) {
    return new Promise((resolve, reject) => {
      const query = `SELECT don_gia FROM HangHoa WHERE ma_hang_hoa = ${db.escape(
        maHangHoa
      )}`;
      db.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  // Cập nhật tổng tiền vào phiếu xuất
  static updateTotalAmount(maPhieuXuat, totalAmount) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE PhieuXuatHang SET tong_tien = ${db.escape(
        totalAmount
      )} WHERE ma_phieu_xuat = ${db.escape(maPhieuXuat)}`;
      db.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
}

module.exports = exportModel;
