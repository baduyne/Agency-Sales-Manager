let debt = 0;
let dealerId = "";
let dealerName = "";
function listen() {
  const nameInput = document.querySelector(".name");
  const addressInput = document.querySelector('input[name="input_address"]');
  const phoneInput = document.querySelector('input[name="input_phone"]');
  const emailInput = document.querySelector('input[name="input_email"]');
  const dateInput = document.querySelector('input[name="input_date"]');
  const priceInput = document.querySelector('input[name="input_price"]');

  // Tự động điền ngày hiện tại vào input
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0]; // Định dạng "YYYY-MM-DD"
  dateInput.value = formattedDate;

  nameInput.addEventListener("change", () =>
    handleNameInput(nameInput, addressInput, phoneInput, emailInput)
  );
}

async function handleNameInput(
  nameInput,
  addressInput,
  phoneInput,
  emailInput
) {
  const inputName = nameInput.value.trim();

  if (!inputName) {
    alert("Vui lòng nhập tên đại lý!");
    return;
  }

  debt = 0;

  try {
    const matchedAgency = await getDealerInfo(inputName);
    if (matchedAgency) {
      dealerName = matchedAgency.ten_dai_ly || "";
      addressInput.value = matchedAgency.quan || "";
      phoneInput.value = matchedAgency.sdt || "";
      emailInput.value = matchedAgency.email || "";
      debt = parseFloat(matchedAgency.tong_no) || 0;
      dealerId = matchedAgency.ma_dai_ly || "";
    } else {
      addressInput.value = phoneInput.value = emailInput.value = "";
      alert("Không tìm thấy đại lý!");
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin đại lý:", error.message);
    alert("Có lỗi xảy ra khi truy vấn thông tin đại lý");
    addressInput.value = phoneInput.value = emailInput.value = "";
  }
}

function clearStorage() {
  localStorage.removeItem("input_name");
  localStorage.removeItem("input_address");
  localStorage.removeItem("input_phone");
  localStorage.removeItem("input_email");
  localStorage.removeItem("input_date");
  localStorage.removeItem("input_price");
}

async function createReceipt() {
  const address = document
    .querySelector('input[name="input_address"]')
    .value.trim();
  const phone = document
    .querySelector('input[name="input_phone"]')
    .value.trim();
  const email = document
    .querySelector('input[name="input_email"]')
    .value.trim();
  const date = document.querySelector('input[name="input_date"]').value;
  const priceInput = document.querySelector('input[name="input_price"]');
  const price = parseFloat(priceInput.value);

  // Kiểm tra dữ liệu đầu vào
  if (
    !dealerName ||
    !address ||
    !phone ||
    !email ||
    !date ||
    isNaN(price) ||
    price <= 0
  ) {
    alert("Vui lòng điền đầy đủ và hợp lệ thông tin!");
    return;
  }

  if (price > debt) {
    alert(
      `Đại lý hiện đang nợ: ${formatCurrency(
        debt
      )}. Vui lòng không thu vượt quá số tiền đang nợ.`
    );
    return;
  }

  const docDefinition = generateReceiptPDF(
    dealerName,
    address,
    phone,
    email,
    date,
    price
  );

  // Tạo và tải file PDF
  pdfMake.createPdf(docDefinition).download(`phieu-thu-tien-${dealerName}.pdf`);

  const newReceiptCode = await getNewReceiptCode();
  const receiptData = {
    ma_phieu_thu_tien: newReceiptCode,
    ma_dai_ly: dealerId,
    ngay_lap_phieu: date,
    so_tien_thu: price,
  };

  // Gửi dữ liệu lên server
  try {
    await postReceipt(receiptData);
    console.log("Dữ liệu đã được gửi thành công.");

    const remainingDebt = debt - price;
    await updateDealerDebt(dealerId, remainingDebt);
    console.log("Cập nhật thành công nợ đại lý.");
  } catch (error) {
    console.error("Có lỗi xảy ra khi gửi dữ liệu:", error);
  }

  alert("Tạo phiếu thu tiền thành công!");

  // Tải lại trang sau khi hoàn tất
  location.reload(); // Load lại trang
}

function generateReceiptPDF(name, address, phone, email, date, price) {
  return {
    content: [
      {
        text: "PHIẾU THU TIỀN",
        style: "header",
        alignment: "center",
        margin: [0, 10, 0, 20],
      },
      {
        table: {
          widths: ["30%", "70%"],
          body: [
            [
              { text: "Đại lý:", bold: true },
              { text: name, alignment: "left" },
            ],
            [
              { text: "Địa chỉ (quận):", bold: true },
              { text: address, alignment: "left" },
            ],
            [
              { text: "Điện thoại:", bold: true },
              { text: phone, alignment: "left" },
            ],
            [
              { text: "Email:", bold: true },
              { text: email, alignment: "left" },
            ],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 20],
      },
      {
        text: "Thông tin thu tiền",
        style: "subheader",
        alignment: "left",
        margin: [0, 10, 0, 10],
      },
      {
        table: {
          widths: ["50%", "50%"],
          body: [
            [
              { text: "Ngày thu tiền:", bold: true },
              { text: date, alignment: "center" },
            ],
            [
              { text: "Số tiền thu:", bold: true },
              {
                text: formatCurrency(price),
                alignment: "center",
                color: "red",
                bold: true,
              },
            ],
          ],
        },
        layout: "headerLineOnly",
        margin: [0, 0, 0, 20],
      },
      {
        columns: [
          {
            text: "Chữ ký người nộp tiền",
            alignment: "left",
            margin: [0, 50, 0, 0],
          },
          {
            text: "Chữ ký người lập phiếu",
            alignment: "left",
            margin: [0, 50, 0, 0],
          },
        ],
      },
    ],
    styles: {
      header: { fontSize: 22, bold: true, color: "#333" },
      subheader: { fontSize: 18, bold: true, color: "#555" },
    },
    defaultStyle: { font: "Roboto" },
  };
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

async function getDealerInfo(dealerName) {
  const url = `/dealer?dealerName=${encodeURIComponent(dealerName)}`;
  const response = await fetch(url);

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Không thể kết nối đến backend");
  }

  return response.json();
}

async function postReceipt(data) {
  const url = "/postreceipt";
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Lỗi khi gửi POST: ${response.statusText}`);
  }

  return response.json();
}

async function getNewReceiptCode() {
  const url = "/tableReceipt";
  const response = await fetch(url);
  const data = await response.json();

  if (Array.isArray(data) && data.length > 0) {
    const newReceiptCode = "PTT" + (data.length + 1).toString();
    return newReceiptCode;
  }

  console.log("Dữ liệu không hợp lệ hoặc mảng rỗng.");
  return null;
}

async function updateDealerDebt(dealerId, debt) {
  const url = `/updatedealer?dealerId=${encodeURIComponent(dealerId)}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ debt }),
  });

  if (!response.ok) {
    throw new Error(`Lỗi khi cập nhật đại lý: ${response.statusText}`);
  }

  return response.json();
}

listen();
