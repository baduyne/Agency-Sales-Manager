const e = require("express");
const db = require("../../config/connectDB/connect");

function getCurrentDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // tháng từ 0-11 nên cần cộng thêm 1
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function getTypeAgency(callback) {
  const query = "SELECT * FROM LoaiDaiLy";

  db.query(query, [], (err, result) => {
    if (err) {
      console.error("Lỗi khi truy vấn: ", err.message);
      return callback(
        { message: "Lỗi truy vấn cơ sở dữ liệu", error: err },
        null
      );
    }

    if (result.length == 0) {
      return callback(null, { message: "Không có dữ liệu" });
    }

    callback(null, result);
  });
}

function commitChangeType(type, callback) {
  db.query("SELECT * FROM LoaiDaiLy", (err, currentType) => {
    if (err) {
      console.error("Lỗi khi truy vấn dữ liệu:", err);
      return callback(err, null);
    }

    let counter = 0;
    type.forEach((each) => {
      const id = each.ma_loai;
      const maxDebt = parseFloat(each.so_tien_no_toi_da);

      const currentMatch = currentType.find((item) => item.ma_loai === id);

      if (currentMatch) {
        const query =
          "UPDATE LoaiDaiLy SET so_tien_no_toi_da = ? WHERE ma_loai = ?";

        db.query(query, [maxDebt, id], (err, result) => {
          if (err) {
            console.error("Lỗi khi cập nhật:", err);
            return callback(err, null);
          }

          console.log("Cập nhật thành công:", result);

          if (type.indexOf(each) === type.length - 1) {
            return callback(null, result);
          }
        });
      } else {
        const query =
          "INSERT INTO LoaiDaiLy (ma_loai, so_tien_no_toi_da) VALUES (?, ?);";
        db.query(query, [id, maxDebt], (err, result) => {
          if (err) {
            console.error("Lỗi khi thêm:", err);
            return callback(err, null);
          }
          console.log("Thêm thành công:", result);
          if (type.indexOf(each) === type.length - 1) {
            return callback(null, result);
          }
        });
      }
    });
  });
}

function getValuemMax(callback) {
  const query = "CALL sp_SelectLatestQuyDinh();";
  db.query(query, [], (err, result) => {
    if (err) {
      console.error("Lỗi khi truy vấn: ", err.message);
      return callback(
        { message: "Lỗi khi truy vấn dữ liệu", error: err },
        null
      );
    }

    if (result.length == 0) {
      return callback(null, { message: "Không có dữ liệu" });
    }
    console.log(result);
    callback(null, result);
  });
}

function insertRule(newData, type, callback) {
  db.query("SELECT * FROM QuyDinh", [], (err, listRule) => {
    if (err) {
      console.error("Lỗi truy vấn: ", err.message);
      return callback({ message: "Lỗi truy vấn", error: err }, null);
    }

    const length = listRule.length + 1;
    const idRule = "QD" + length.toString();

    const today = getCurrentDateTime();

    if (type === "maxAgency") {
      const query =
        "INSERT INTO QuyDinh (ma_quy_dinh, ngay_cap_nhat, so_dai_ly_toi_da_trong_quan, so_loai_hang_toi_da_trong_phieu_xuat, so_don_vi_tinh_toi_da_trong_phieu_xuat) VALUES (?, ?, ?, ?, ?);";
      db.query(
        query,
        [
          idRule,
          today,
          newData,
          listRule[length - 2].so_loai_hang_toi_da_trong_phieu_xuat,
          listRule[length - 2].so_don_vi_tinh_toi_da_trong_phieu_xuat,
        ],
        (err, result) => {
          if (err) {
            console.error("Lỗi insert: ", err.message);
            return callback({ message: "Lỗi insert", error: err }, null);
          }

          console.log("Thêm thành công:", result);
          callback(null, result);
        }
      );
    } else if (type === "maxGoods") {
      const query =
        "INSERT INTO QuyDinh (ma_quy_dinh, ngay_cap_nhat, so_dai_ly_toi_da_trong_quan, so_loai_hang_toi_da_trong_phieu_xuat, so_don_vi_tinh_toi_da_trong_phieu_xuat) VALUES (?, ?, ?, ?, ?);";
      db.query(
        query,
        [
          idRule,
          today,
          listRule[length - 2].so_dai_ly_toi_da_trong_quan,
          newData,
          listRule[length - 2].so_don_vi_tinh_toi_da_trong_phieu_xuat,
        ],
        (err, result) => {
          if (err) {
            console.error("Lỗi insert: ", err.message);
            return callback({ message: "Lỗi insert", error: err }, null);
          }

          console.log("Thêm thành công:", result);
          callback(null, result);
        }
      );
    } else if (type === "maxUnit") {
      const query =
        "INSERT INTO QuyDinh (ma_quy_dinh, ngay_cap_nhat, so_dai_ly_toi_da_trong_quan, so_loai_hang_toi_da_trong_phieu_xuat, so_don_vi_tinh_toi_da_trong_phieu_xuat) VALUES (?, ?, ?, ?, ?);";
      db.query(
        query,
        [
          idRule,
          today,
          listRule[length - 2].so_dai_ly_toi_da_trong_quan,
          listRule[length - 2].so_loai_hang_toi_da_trong_phieu_xuat,
          newData,
        ],
        (err, result) => {
          if (err) {
            console.error("Lỗi insert: ", err.message);
            return callback({ message: "Lỗi insert", error: err }, null);
          }

          console.log("Thêm thành công:", result);
          callback(null, result);
        }
      );
    }
  });
}

module.exports = { getTypeAgency, commitChangeType, getValuemMax, insertRule };
