// lấy danh sách báo cáo doanh số
function getListRevenue(month, year) {
  fetch(`/api/list-revenue?month=${month}&year=${year}`, {
    method: "GET",
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        return response.json().then((data) => {
          throw new Error(data.message || "Đã có lỗi xảy ra");
        });
      }
    })
    .then((results) => {
      document.querySelector(".report").classList.remove("hidden");
      document.querySelector(".revenue-table").classList.remove("hidden");
      document.querySelector(".debt-table").classList.add("hidden");

      // render dữ liệu
      let i = 1;
      let stringTable = "";
      var toCSV = `
        Báo cáo doanh số tháng ${month}/${year}\n\n
        STT,Đại lý,Số phiếu xuất, Tổng giá trị, Tỉ lệ\n`;

      results.data[0].forEach(function (each) {
        stringTable += `
              <tr>
                  <td>${i}</td>
                  <td>${each.ten_dai_ly}</td>
                  <td>${each.tong_so_luong_phieu_xuat}</td>
                  <td>$${each.tong_gia_tri_phieu_xuat}</td>
                  <td>${(each.ti_le * 100).toFixed(2)}%</td>
              </tr>`;
        toCSV += `${i},${each.ten_dai_ly},${each.tong_so_luong_phieu_xuat},$${
          each.tong_gia_tri_phieu_xuat
        },${(each.ti_le * 100).toFixed(2)}%\n`;
        i++;
      });

      downloadFile(toCSV, `ReportRevenue_${month}/${year}.CSV`);

      document.querySelector(".revenue-table .revenue-body").innerHTML =
        stringTable;
    })
    .catch((error) => console.error("Error", error));
}

//lấy danh sách báo cái công nợ
function getListDebt(month, year) {
  fetch(`/api/list-debt?month=${month}&year=${year}`, {
    method: "GET",
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        return response.json().then((data) => {
          throw new Error(data.message || "Đã có lỗi xảy ra");
        });
      }
    })
    .then((results) => {
      document.querySelector(".report").classList.remove("hidden");
      document.querySelector(".debt-table").classList.remove("hidden");
      document.querySelector(".revenue-table").classList.add("hidden");

      // render dữ liệu
      let i = 1;
      let stringTable = "";
      var toCSV = `
      Báo cáo công nợ tháng ${month}/${year}\n\n
      STT,Đại lý,Nợ đầu, Phát sinh, Nợ cuối\n`;

      results.data[0].forEach(function (each) {
        stringTable += `
            <tr>
                <td>${i}</td>
                <td>${each.ten_dai_ly}</td>
                <td>$${each.no_dau}</td>
                <td>$${each.phat_sinh}</td>
                <td>$${each.no_cuoi}</td>
            </tr>`;
        toCSV += `${i},${each.ten_dai_ly},$${each.no_dau},$${each.phat_sinh},$${each.no_cuoi}\n`;
        i++;
      });

      downloadFile(toCSV, `ReportDebt_${month}/${year}.CSV`);

      document.querySelector(".debt-table .debt-body").innerHTML = stringTable;
    })
    .catch((error) => console.error("Error", error));
}

function getList() {
  const btnActive = document.querySelector(".btn-report-writing");
  const today = getCurrentMonthYear();
  const typeReport = document.querySelector(".type-report .type");

  btnActive.addEventListener("click", function () {
    const month = today.month;
    const year = today.year;

    if (typeReport.value === "revenue") {
      getListRevenue(month, year);
      return;
    }
    if (typeReport.value === "debt") {
      getListDebt(month, year);
      return;
    }
    alert("Vui lòng chọn loại báo cáo");
  });
}

function downloadFile(content, filename) {
  let btnActive = document.querySelector(".btn-download");

  btnActive.onclick = function () {
    const encodedUri = "data:text/csv;charset=utf-8,\uFEFF" + content;
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
}

// láy tháng năm hiện tại
function getCurrentMonthYear() {
  const today = new Date();
  const month = today.getMonth() + 1; // getMonth() trả về giá trị từ 0 đến 11, cộng thêm 1 để có tháng thực tế
  const year = today.getFullYear();

  document.querySelector(".time-create span").innerText = `${month} / ${year}`;

  return {
    month: month,
    year: year,
  };
}

getList();
