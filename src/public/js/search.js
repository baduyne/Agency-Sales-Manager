var SearchApi = `http://localhost:3000/search/api`;
//const fuse = require('fuse');

document.getElementById("search-button").onclick = async function () {
  document.querySelector(".search-text").classList.remove("hidden");
  try {
    const response = await fetch(SearchApi);
    if (!response.ok) {
      throw new Error("Không thể tải dữ liệu");
    }
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));

    const searchValue = document
      .getElementById("search-agent")
      .value.trim()
      .toLowerCase();

    // Sử dụng Fuse.js
    const fuse = new Fuse(data, {
      keys: ["TenDaiLy"],
      threshold: 0.4,
    });

    const filteredAgents = fuse
      .search(searchValue)
      .map((result) => result.item);

    const agentListElement = document.getElementById("agent-list");
    agentListElement.innerHTML = "";

    if (filteredAgents.length === 0) {
      agentListElement.innerHTML = "<p>Không tìm thấy đại lý nào!</p>";
      return;
    }

    const table = document.createElement("table");
    table.innerHTML = `
                <thead>
                <tr>
                    <th>STT</th>
                    <th>Tên Đại Lý</th>
                    <th>Loại Đại Lý</th>
                    <th>Quận</th>
                    <th>Tiền Nợ</th>
                </tr>
                </thead>
            `;

    const formatCurrencyUSD = (value) => {
      // Kiểm tra nếu giá trị không phải là số hoặc là NaN thì trả về 0
      if (isNaN(value)) {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(0);
      }

      // Kiểm tra nếu giá trị là số nguyên, bỏ phần thập phân
      if (value % 1 === 0) {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        })
          .format(value)
          .replace(".00", "");
      } else {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value);
      }
    };

    filteredAgents.forEach((data, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${data.TenDaiLy}</td>
                    <td>${data.MaLoai}</td>
                    <td>${data.Quan}</td>
                    <td>${formatCurrencyUSD(data.TongNo)}</td>
                `;
      table.appendChild(row);
    });

    agentListElement.appendChild(table);
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("agent-list").innerHTML =
      "<p>Đã xảy ra lỗi khi tải dữ liệu ...</p>";
  }
};
