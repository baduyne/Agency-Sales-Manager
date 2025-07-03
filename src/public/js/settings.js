// lock input
function lockInput() {
  const maximumDebt = document.querySelectorAll("label input");
  maximumDebt.forEach(function (eachInput) {
    eachInput.disabled = true;
  });
}

// render loại đại lý
function renderTypeAgency() {
  window.addEventListener("DOMContentLoaded", function () {
    fetch("/settings/api/agency-type")
      .then((response) => {
        if (response.status === 200) return response.json();
        else
          return response.json().then((data) => {
            throw new Error(data.message || "Đã xảy ra lỗi");
          });
      })
      .then((data) => {
        let render = "";
        data.data.forEach(function (each) {
          render += `
          <li>
            <label>
              Loại ${each.ma_loai.slice(1)}:
              <input type="number" value="${each.so_tien_no_toi_da}"/>
            </label>
          </li>`;
        });

        const ulType = document.querySelector(".agency-type .type");
        ulType.innerHTML = render;

        //
        insertButton(data.data);

        // Cập nhật phần tử theo DOM
        saveTypeAgency(data.data);

        lockInput();
      })
      .catch((err) => {
        console.error(err);
      });
  });
}

// render các giá trị tối đa
function renderMax() {
  window.addEventListener("DOMContentLoaded", function () {
    fetch("/settings/api/rule")
      .then((response) => {
        if (response.status === 200) return response.json();
        else
          return response.json().then((data) => {
            throw new Error(data.message || "Đã xảy ra lỗi");
          });
      })
      .then((data) => {
        const getData = data.data[0][0];
        // Số đại lý tối đa
        const maxAgency = document.querySelector(
          ".maximum-agency .maximum input"
        );
        maxAgency.value = getData.so_dai_ly_toi_da_trong_quan;

        // Số mặt hàng tối đa
        const maxGoods = document.querySelector(".goods-count .maximum input");
        maxGoods.value = getData.so_loai_hang_toi_da_trong_phieu_xuat;

        // Đơn vị tối đa
        const maxUnit = document.querySelector(".unit-list .maximum input");
        maxUnit.value = getData.so_don_vi_tinh_toi_da_trong_phieu_xuat;

        // Lưu
        saveMaxAgency(getData.so_dai_ly_toi_da_trong_quan);
        saveMaxGoods(getData.so_loai_hang_toi_da_trong_phieu_xuat);
        saveMaxUnit(getData.so_don_vi_tinh_toi_da_trong_phieu_xuat);
      })
      .catch((err) => {
        console.error(err);
      });
  });
}

var listDebt = [];
var maximumAgency = -1;
var maximumGoods = -1;
var maximumUnit = -1;
function editButton() {
  const btnActive = document.querySelectorAll(".edit");

  btnActive.forEach(function (eachButton) {
    eachButton.addEventListener("click", (event) => {
      const parentClassName = eachButton.parentElement.className;

      // Loại đai lý và tiền nợ tối đa
      if (parentClassName.includes("agency-type")) {
        const maximumDebt = document.querySelectorAll(".type  label input");

        // lock hoặc unlock input
        maximumDebt.forEach(function (eachInput) {
          if (eachInput.disabled == true) {
            // Lưu lại giá trị cũ
            if (listDebt.indexOf(eachInput.value) === -1)
              listDebt.push(eachInput.value);
            eachInput.disabled = false;
            return;
          }
          if (eachInput.disabled == false) eachInput.disabled = true;
        });

        // Trả lại giá trị cũ nếu cancel
        if (listDebt.length !== 0) {
          let i = 0;
          maximumDebt.forEach(function (eachInput) {
            eachInput.value = listDebt[i];
            i++;
          });
        }

        const infoBTN = eachButton.querySelector("button");
        if (infoBTN.innerText == "Hủy") infoBTN.innerText = "Sửa";
        else infoBTN.innerText = "Hủy";
      }

      // Số lượng đại lý tối đa trong quận
      if (parentClassName.includes("maximum-agency")) {
        const maxAgency = document.querySelector(
          ".maximum-agency .maximum input"
        );

        // lock hoặc unlock input
        if (maxAgency.disabled == true) {
          maxAgency.disabled = false;
          maximumAgency = maxAgency.value;
        } else {
          maxAgency.disabled = true;
        }

        // Trả lại giá trị cũ nếu cancel
        if (maximumAgency !== -1) {
          maxAgency.value = maximumAgency;
        }

        const infoBTN = eachButton.querySelector("button");
        if (infoBTN.innerText == "Hủy") infoBTN.innerText = "Sửa";
        else infoBTN.innerText = "Hủy";
      }

      // Số lượng mặt hàng tối đa
      if (parentClassName.includes("goods-count")) {
        const maxGoods = document.querySelector(".goods-count .maximum input");

        // lock hoặc unlock input
        if (maxGoods.disabled == true) {
          maxGoods.disabled = false;
          maximumGoods = maxGoods.value;
        } else {
          maxGoods.disabled = true;
        }

        // Trả lại giá trị cũ nếu cancel
        if (maximumGoods !== -1) {
          maxGoods.value = maximumGoods;
        }

        const infoBTN = eachButton.querySelector("button");
        if (infoBTN.innerText == "Hủy") infoBTN.innerText = "Sửa";
        else infoBTN.innerText = "Hủy";
      }

      // Số đơn vị tối đa
      if (parentClassName.includes("unit-list")) {
        const maxUnit = document.querySelector(".unit-list .maximum input");

        // lock hoặc unlock input
        if (maxUnit.disabled == true) {
          maxUnit.disabled = false;
          maximumUnit = maxUnit.value;
        } else {
          maxUnit.disabled = true;
        }

        // Trả lại giá trị cũ nếu cancel
        if (maximumUnit !== -1) {
          maxUnit.value = maximumUnit;
        }

        const infoBTN = eachButton.querySelector("button");
        if (infoBTN.innerText == "Hủy") infoBTN.innerText = "Sửa";
        else infoBTN.innerText = "Hủy";
      }
    });
  });
}

// Thêm button
function insertButton(currentData) {
  const btnInsert = document.querySelector(".insert button");

  let statusButton = true;
  let lastElement = null;

  btnInsert.addEventListener("click", (e) => {
    let list = document.querySelector(".type");

    // Thêm
    if (statusButton == true) {
      // Thêm
      const li = document.createElement("li");
      li.innerHTML = `
        <label>
          Loại ${currentData.length + 1}:
          <input type="number" value="0" />
        </label>`;
      list.appendChild(li);
      lastElement = li;
      btnInsert.innerText = "Hủy";
    }
    // Hủy
    else {
      // Hủy
      if (lastElement) {
        list.removeChild(lastElement);
        lastElement = null;
      }
      btnInsert.innerText = "Thêm";
    }
    statusButton = !statusButton;
  });
}

// Lưu thay đổi của Loại đại lý và tiền nợ tối đa
function saveTypeAgency(oldData) {
  const btnSave = document.querySelector(".agency-type .save button");

  btnSave.addEventListener("click", (event) => {
    const listType = document.querySelectorAll(".agency-type .type li");
    var newData = [];

    listType.forEach((each) => {
      // Lấy mã loại đại lý
      const label = each.querySelector("label").innerText;
      const ma_loai = label.replace("oại ", "").replace(": ", "");
      // lấy giá trị loại đại lý
      const input = each.querySelector("input");
      const so_tien_no_toi_da = input.value;

      newData.push({ ma_loai, so_tien_no_toi_da });
    });

    // Kiểm tra nếu không có thay đổi
    if (JSON.stringify(oldData) === JSON.stringify(newData)) {
      alert("Không có gì thay đổi");
    } else {
      // Có thể thực hiện gọi API ở đây để lưu dữ liệu
      fetch("/settings/api/agency-type", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Đảm bảo gửi dưới dạng JSON
        },
        body: JSON.stringify(newData),
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          else
            return response.json().then((data) => {
              throw new Error(data.message || "Đã xảy ra lỗi");
            });
        })
        .then((data) => {
          alert(data.message);
          window.location.reload();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });
}

// Lưu số lượng đại lý tối đa
function saveMaxAgency(oldData) {
  const btnSave = document.querySelector(".maximum-agency .save button");

  btnSave.addEventListener("click", (e) => {
    let newData = document.querySelector(
      ".maximum-agency .maximum input"
    ).value;

    if (oldData == newData) {
      alert("Không có gì thay đổi");
    } else {
      fetch("/settings/api/rule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ new: newData, type: "maxAgency" }),
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          else
            return response.json().then((data) => {
              throw new Error(data.message || "Đã xảy ra lỗi");
            });
        })
        .then((data) => {
          alert(data.message);
          window.location.reload();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });
}

// lưu số hàng hóa tối đa
function saveMaxGoods(oldData) {
  const btnSave = document.querySelector(".goods-count .save button");

  btnSave.addEventListener("click", (e) => {
    let newData = document.querySelector(".goods-count .maximum input").value;

    if (oldData == newData) {
      alert("Không có gì thay đổi");
    } else {
      fetch("/settings/api/rule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ new: newData, type: "maxGoods" }),
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          else
            return response.json().then((data) => {
              throw new Error(data.message || "Đã xảy ra lỗi");
            });
        })
        .then((data) => {
          alert(data.message);
          window.location.reload();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });
}

// lưu số đơn vị tối đa
function saveMaxUnit(oldData) {
  const btnSave = document.querySelector(".unit-list .save button");

  btnSave.addEventListener("click", (e) => {
    let newData = document.querySelector(".unit-list .maximum input").value;

    if (oldData == newData) {
      alert("Không có gì thay đổi");
    } else {
      fetch("/settings/api/rule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ new: newData, type: "maxUnit" }),
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          else
            return response.json().then((data) => {
              throw new Error(data.message || "Đã xảy ra lỗi");
            });
        })
        .then((data) => {
          alert(data.message);
          window.location.reload();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });
}

editButton();
renderTypeAgency();
renderMax();
