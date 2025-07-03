const e = require("express");
const db = require("../../config/connectDB/connect");

const getRevenue = function (month, year, callback) {
  const query = "CALL sp_GetAllDaiLySummary(?, ?);";

  db.query(query, [month, year], (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn: ", err.message);
      return callback(
        { message: "Lỗi truy vấn cơ sở dữ liệu", error: err },
        null
      );
    }
    if (results.length === 0) {
      return callback(null, {
        message: "Không có dữ liệu",
      });
    }

    // Insert vào bảng doanh thu
    db.query("SELECT * FROM DoanhSo", (err, listRevenue) => {
      if (err) {
        console.error("Lỗi khi truy vấn: ", err.message);
        return callback(
          { message: "Lỗi truy vấn cơ sở dữ liệu", error: err },
          null
        );
      }

      let length = listRevenue.length + 1;

      results[0].forEach((each) => {
        const id = "DS" + length.toString();
        const queryInsert =
          "INSERT INTO DoanhSo (ma_doanh_so, ma_dai_ly, thang, nam) VALUES (?, ?, ?, ?);";
        db.query(
          queryInsert,
          [id, each.ma_dai_ly, month, year],
          (err, inserted) => {
            if (err) {
              console.error("Lỗi khi thêm dữ liệu:", err.message);
              return callback(err, null);
            }
            console.log("Thêm doanh số thành công");
          }
        );
        length++;
      });
      callback(null, results);
    });
  });
};

const getDebt = function (month, year, callback) {
  const query = " CALL sp_LayBaoCaoCongNo(?, ?);";

  db.query(query, [month, year], (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn: ", err.message);
      return callback(
        { message: "Lỗi truy vấn cơ sở dữ liệu", error: err },
        null
      );
    }
    if (results.length === 0) {
      return callback(null, {
        message: "Không có dữ liệu",
      });
    }

    // Insert vào bảng công nợ
    db.query("SELECT * FROM CongNo", (err, listDebt) => {
      if (err) {
        console.error("Lỗi khi truy vấn: ", err.message);
        return callback(
          { message: "Lỗi truy vấn cơ sở dữ liệu", error: err },
          null
        );
      }

      let length = listDebt.length + 1;

      results[0].forEach((each) => {
        const id = "CN" + length.toString();
        console.log(id, each.no_dau, each.phat_sinh);
        const queryInsert =
          "INSERT INTO CongNo (ma_cong_no, ma_dai_ly, thang, nam, no_dau, no_phat_sinh) VALUES (?, ?, ?, ?, ?, ?);";
        db.query(
          queryInsert,
          [id, each.ma_dai_ly, month, year, each.no_dau, each.phat_sinh],
          (err, inserted) => {
            if (err) {
              console.error("Lỗi khi thêm dữ liệu:", err.message);
              return callback(err, null);
            }
            console.log("Thêm công nợ thành công");
          }
        );
        length++;
      });
      callback(null, results);
    });
  });
};

module.exports = { getRevenue, getDebt };
