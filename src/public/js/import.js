var exportApi = "http://localhost:3000/import/api";
var myHeaders = {
  "Content-Type": "application/json", // Gửi dữ liệu JSON
};

function start() {
  handleCreateImport(reload);
}

function handleCreateImport(callback) {
  var CreateBtn = document.querySelector("#submit-import");
  CreateBtn.onclick = function () {
    var name = document.querySelector('input[name="import-name"]').value;
    var type = document.querySelector("#import-type").value;
    var phone = document.querySelector('input[name="import-SDT"]').value;
    var address = document.querySelector('input[name="import-address"]').value;
    var dictrict = document.querySelector("#dictrict-type").value;
    var email = document.querySelector('input[name="import-email"]').value;

    if (!name || !type || !phone || !address || !dictrict || !email) {
      alert("Nhập thiếu thông tin đại lý!");
      return;
    }

    var formdata = {
      name: name,
      type: type,
      SDT: phone,
      address: address,
      dictrict: dictrict,
      email: email,
    };

    // Gọi hàm createImport và truyền callback
    createImport(formdata, callback);
  };
}

async function createImport(data, callback) {
  var options = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(exportApi, options);
    const responseData = await response.json();
    console.log("kq database:", responseData); // Kiểm tra dữ liệu trả về từ server

    // Kiểm tra nếu responseData có thuộc tính err và err có errno
    if (responseData.err && responseData.err.errno) {
      if (responseData.err.errno === 1644) {
        alert("Quận này đã có đủ 4 đại lý. Không thể thêm đại lý mới!");
      } else if (responseData.err.errno === 1062) {
        alert("SDT hoặc email đã được sử dụng vui lòng thử lại!");
      } else {
        alert("Lỗi: " + responseData.err.sqlMessage || "Không xác định");
      }
    } else if (responseData.error) {
      alert("Lỗi: " + responseData.error);
    } else {
      alert(responseData.message || "Thành công!");
      window.location.reload();
    }

    callback(); // Gọi hàm reload sau khi thành công
  } catch (error) {
    alert("Đã xảy ra lỗi: " + error.message);
    console.error("Error:", error); // Ghi lại lỗi chi tiết để debug dễ dàng hơn
  }
}

function reload() {
  var inputs = document.querySelectorAll("input"); // Chọn tất cả các <input>
  var selects = document.querySelectorAll("select"); // Chọn tất cả các <select>
  // Xóa dữ liệu trong các trường input
  inputs.forEach((input) => (input.value = ""));
  // Reset các trường select về giá trị mặc định
  selects.forEach((select) => (select.selectedIndex = 0));
}

start();
