const db = require("../../config/connectDB/connect"); // Import kết nối MySQL

class searchModel {
  static getSearch() {
    return new Promise((resolve, reject) => {
      const query = `CALL GetAllDaiLy()`;
      db.query(query, (err, results) => {
        if (err) {
          console.error("Lỗi SQL khi loc dai ly:", err);
          return reject(err);
        }
        resolve(results);
      });
    });
  }
}
module.exports = searchModel;
