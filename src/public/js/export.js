var exportsApi = `http://localhost:3000/export/api`;

document.addEventListener("DOMContentLoaded", () => {
  // Lấy phần tử input cho ngày
  const dateInput = document.getElementById("date-export");
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0]; // Format thành yyyy-mm-dd
  dateInput.value = formattedDate;
});

document.addEventListener("DOMContentLoaded", function () {
  const addItemBtn = document.getElementById("add-item-btn");
  const messageBox = document.getElementById("message-box");
  const exportTable = document
    .getElementById("export-table")
    .querySelector("tbody");
  const storeSelect = document.getElementById("store-select");

  let maxTotal = 0;
  let maxProduct = 0;
  let maxUnit = 0;

  function renderItems(items) {
    const dropdown = document.createElement("select");
    dropdown.classList.add("item-select");

    // Tùy chọn mặc định "Chọn sản phẩm"
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Chọn sản phẩm";
    defaultOption.selected = true;
    dropdown.appendChild(defaultOption);

    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.ma_hang_hoa;
      option.textContent = item.ten_hang_hoa;
      option.dataset.price = item.don_gia;
      option.dataset.unit = item.ten_don_vi_tinh;
      dropdown.appendChild(option);
    });

    return dropdown;
  }

  // Hàm cập nhật lại số thứ tự trong bảng
  function updateRowNumbers() {
    Array.from(exportTable.children).forEach((row, index) => {
      row.querySelector("td:first-child").textContent = index + 1;
    });
  }

  function addRow(itemData) {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${exportTable.children.length + 1}</td>
        <td>${renderItems(itemData).outerHTML}</td>
        <td><input type="text" class="unit" readonly></td>
        <td><input type="number" class="quantity" min="1" value="1"></td>
        <td><input type="text" class="price" readonly></td>
        <td><input type="text" class="total" readonly></td>
        <td><button class="delete-item-btn">Xóa</button></td>
    `;

    exportTable.appendChild(row);
  }

  // Cập nhật thông báo
  function updateMessage(message, type = "error") {
    messageBox.textContent = message;
    messageBox.style.color = type === "error" ? "red" : "green";
  }

  function validateTotal(total, productCount, unitCount) {
    if (total > maxTotal) {
      updateMessage(`Tổng tiền không được vượt quá tiền nợ (${maxTotal} VND)`);
      return false;
    }
    if (unitCount > maxUnit) {
      updateMessage(
        `Vượt quá số đơn vị tính cho phép, tối đa ${maxUnit} đơn vị`
      );
      return false;
    }
    if (productCount > maxProduct) {
      updateMessage(
        `Vượt quá số mặt hàng cho phép, tối đa ${maxProduct} mặt hàng`
      );
      return false;
    }
    if (productCount === 0) {
      updateMessage("Vui lòng chọn mặt hàng!", "error");
      return false;
    }
    updateMessage("Phiếu xuất hợp lệ", "success");
    return true;
  }

  // Sự kiện thêm hàng hóa
  addItemBtn.addEventListener("click", async () => {
    const selectedStoreId = storeSelect.value;
    if (!selectedStoreId) {
      updateMessage("Vui lòng chọn đại lý!", "error");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/export/api?id=${selectedStoreId}`
      );
      const data = await response.json();

      const items = data.items || [];
      maxTotal = parseFloat(data.debt) || 0;
      const quyDinh = data.rule || {};

      maxProduct = quyDinh.so_loai_hang_toi_da_trong_phieu_xuat || 0;
      maxUnit = quyDinh.so_don_vi_tinh_toi_da_trong_phieu_xuat || 0;

      addRow(items);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      updateMessage("Không thể tải dữ liệu, vui lòng thử lại!", "error");
    }
  });

  exportTable.addEventListener("input", (event) => {
    if (event.target.classList.contains("quantity")) {
      const row = event.target.closest("tr");
      const price = parseFloat(row.querySelector(".price").value) || 0;
      const quantity = parseInt(event.target.value) || 0;
      const totalField = row.querySelector(".total");
      const total = price * quantity;

      totalField.value = total.toFixed(2);

      const validRows = Array.from(exportTable.querySelectorAll("tr")).filter(
        (row) => {
          const selectedOption = row.querySelector(".item-select")?.value;
          return selectedOption;
        }
      );

      // Tính tổng tiền từ các dòng hợp lệ
      const totalMoney = validRows
        .map((row) => parseFloat(row.querySelector(".total").value) || 0)
        .reduce((sum, value) => sum + value, 0);

      const productCount = validRows.length;

      const unitCount = new Set(
        validRows.map((row) => row.querySelector(".unit").value)
      ).size;

      validateTotal(totalMoney, productCount, unitCount);
    }
  });

  // Sự kiện xóa mặt hàng
  exportTable.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-item-btn")) {
      const row = event.target.closest("tr");
      exportTable.removeChild(row);

      // Cập nhật lại số thứ tự
      updateRowNumbers();

      const totalMoney = Array.from(exportTable.querySelectorAll(".total"))
        .map((input) => parseFloat(input.value) || 0)
        .reduce((sum, value) => sum + value, 0);

      const productCount = exportTable.querySelectorAll("tr").length;
      const unitCount = new Set(
        Array.from(exportTable.querySelectorAll(".unit")).map(
          (input) => input.value
        )
      ).size;

      validateTotal(totalMoney, productCount, unitCount);
    }
  });

  exportTable.addEventListener("change", (event) => {
    if (event.target.classList.contains("item-select")) {
      const row = event.target.closest("tr");
      const selectedOption = event.target.selectedOptions[0];

      if (selectedOption.value) {
        const price = parseFloat(selectedOption.dataset.price) || 0;
        const unit = selectedOption.dataset.unit || "";

        row.querySelector(".price").value = price.toFixed(2);
        row.querySelector(".unit").value = unit;

        const quantity = parseInt(row.querySelector(".quantity").value) || 0;
        row.querySelector(".total").value = (price * quantity).toFixed(2);
      } else {
        row.querySelector(".price").value = "";
        row.querySelector(".unit").value = "";
        row.querySelector(".total").value = "";
      }

      const validRows = Array.from(exportTable.querySelectorAll("tr")).filter(
        (row) => {
          const selectedOption = row.querySelector(".item-select")?.value;
          return selectedOption;
        }
      );

      const totalMoney = validRows
        .map((row) => parseFloat(row.querySelector(".total").value) || 0)
        .reduce((sum, value) => sum + value, 0);

      const productCount = validRows.length;

      const unitCount = new Set(
        validRows.map((row) => row.querySelector(".unit").value)
      ).size;

      validateTotal(totalMoney, productCount, unitCount);
    }
  });
});

document.getElementById("export-btn").addEventListener("click", async () => {
  const messageBox = document.getElementById("message-box");
  if (messageBox.innerText !== "Phiếu xuất hợp lệ") {
    alert("Phiếu xuất chưa hợp lệ");
    return;
  }

  const maDaiLy = document.getElementById("store-select").value;
  const storeName =
    document.getElementById("store-select").selectedOptions[0].text;
  const ngayLapPhieu = document.getElementById("date-export").value;

  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const filename = `${storeName}_${day}_${month}_${year}.csv`;

  const danhSachMatHang = Array.from(
    document.querySelectorAll("#export-table tbody tr")
  )
    .filter((row) => row.querySelector(".item-select").value)
    .map((row) => {
      const maHangHoa = row.querySelector(".item-select").value;
      const tenHangHoa =
        row.querySelector(".item-select").selectedOptions[0].textContent;
      const donViTinh = row.querySelector(".unit").value || "";
      const soLuong = parseInt(row.querySelector(".quantity").value) || 0;
      const donGia = parseFloat(row.querySelector(".price").value) || 0;
      const thanhTien = (soLuong * donGia).toFixed(2);
      return {
        maHangHoa,
        tenHangHoa,
        donViTinh,
        soLuong,
        donGia,
        thanhTien,
      };
    });

  // Tạo CSV content
  let csvContent = "STT,Mặt hàng,Đơn vị tính,Số lượng,Đơn giá,Thành tiền\n";
  danhSachMatHang.forEach((item, index) => {
    csvContent += `${index + 1},${item.tenHangHoa},${item.donViTinh},${
      item.soLuong
    },${item.donGia},${item.thanhTien}\n`;
  });

  // Tính tổng tiền
  const totalAmount = danhSachMatHang
    .reduce((total, item) => total + parseFloat(item.thanhTien), 0)
    .toFixed(2);
  csvContent += `, , , ,Tổng tiền,${totalAmount}\n`;

  // Gửi yêu cầu tạo phiếu xuất đến backend
  try {
    const response = await fetch("http://localhost:3000/api/create-export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        maDaiLy,
        ngayLapPhieu,
        Products: danhSachMatHang,
      }),
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message);
      // Tạo và tải file CSV
      const encodedUri = "data:text/csv;charset=utf-8,\uFEFF" + csvContent;
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Lỗi khi gửi dữ liệu:", error);
    alert("Không thể tạo phiếu xuất hàng, vui lòng thử lại sau.");
  }
});
