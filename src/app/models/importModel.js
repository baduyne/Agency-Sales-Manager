const db = require("../../config/connectDB/connect");

class importModel {
  static insertAgency(name, type, SDT, address, dictrict, email) {
    return new Promise((resolve, reject) => {
      const query = `CALL insert_agency(${db.escape(name)}, ${db.escape(
        type
      )}, ${db.escape(SDT)}, ${db.escape(dictrict)}, ${db.escape(email)})`;
      console.log(query); // Để kiểm tra câu lệnh SQL
      db.query(query, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }
}

module.exports = importModel;
