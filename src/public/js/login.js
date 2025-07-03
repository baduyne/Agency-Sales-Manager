// Đăng nhập
function btnLogin() {
  let btnActive = document.querySelector(".btn-login");

  if (btnActive === null) {
    return;
  }

  let userNameInput = document.querySelector(".user-name input");
  let passwordInput = document.querySelector(".password input");

  noSpace(userNameInput);
  noSpace(passwordInput);
  onlyNumber(passwordInput);

  btnActive.addEventListener("click", async (e) => {
    e.preventDefault();
    const userName = userNameInput.value;
    const password = passwordInput.value;

    if (!userName || !password) {
      userNameInput.classList.add("error");
      passwordInput.classList.add("error");
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    fetch("api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, password }),
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        else {
          userNameInput.classList.add("error");
          passwordInput.classList.add("error");
          return response.json().then((data) => {
            throw new Error(data.message || "Đã có lỗi xảy ra");
          });
        }
      })
      .then(function (data) {
        userNameInput.classList.remove("error");
        passwordInput.classList.remove("error");
        //Lưu tên tài khoản vào biến môi trường để hiển thị ở trang home
        sessionStorage.setItem("userName", userName);

        window.location.href = "/home";
        // alert(data.message); //
      })
      .catch(function (error) {
        console.error(error);
        alert(error.message || "Đã xảy ra lỗi khi đăng ký");
      });
  });
}

// Khi gõ vào các ô input lỗi thì sẽ gỡ bỏ thông báo lỗi
function removeError() {
  let inputTags = document.querySelectorAll("input");
  inputTags.forEach(function (inputTag) {
    inputTag.addEventListener("keydown", function () {
      inputTag.classList.remove("error");
    });
  });
}

// Đăng ký tài khoản //
function btnRegister() {
  let btnActive = document.querySelector(".btn-register-account");

  if (btnActive === null) {
    return;
  }

  const userNameInput = document.querySelector(".user-name input");
  const passwordInput = document.querySelector(".password input");
  const confirmInput = document.querySelector(".confirm-password input");

  noSpace(userNameInput);
  noSpace(passwordInput);
  noSpace(confirmInput);
  onlyNumber(passwordInput);
  onlyNumber(confirmInput);

  btnActive.addEventListener("click", function (event) {
    const userName = userNameInput.value;
    const password = passwordInput.value;
    const confirm = confirmInput.value;

    switch (true) {
      case userName === "":
        alert("Vui lòng nhập tên tài khoản");
        userNameInput.classList.add("error");
        return;
      case password === "":
        alert("Vui lòng nhập mật khẩu");
        passwordInput.classList.add("error");
        return;
      case password.length !== 6:
        alert("Mật khẩu phải đủ 6 ký tự");
        passwordInput.classList.add("error");
        return;
      case confirm === "":
        alert("Vui lòng xác nhận mật khẩu");
        confirmInput.classList.add("error");
        return;
      case password !== confirm:
        alert("Xác nhập mật khẩu không chính xác");
        passwordInput.classList.add("error");
        confirmInput.classList.add("error");
        return;
    }

    fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName,
        password,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          passwordInput.classList.add("error");

          return response.json().then((data) => {
            throw new Error(data.message || "Đã có lỗi xảy ra");
          });
        }
      })
      .then(function (data) {
        userNameInput.classList.remove("error");
        passwordInput.classList.remove("error");
        confirmInput.classList.remove("error");

        alert(data.message + ", trở về trang đăng nhập");
        window.location.href = "/login";
      })
      .catch(function (error) {
        console.error(error);
        alert(error.message || "Đã xảy ra lỗi khi đăng ký");
      });
  });
}

// Tìm tài khoản để thay đổi mật khẩu
var nameAccountFind = "";
function btnFindAccount() {
  let btnActiveFind = document.querySelector(".btn-find-account");

  if (btnActiveFind === null) {
    return;
  }

  let userNameInput = document.querySelector(".user-name-find input");

  noSpace(userNameInput);

  btnActiveFind.addEventListener("click", async (e) => {
    nameAccountFind = userNameInput.value;
    if (nameAccountFind === "") {
      alert("Vui lòng nhập tên tài khoản");
      userNameInput.classList.add("error");
      return;
    }

    fetch("/api/forget-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nameAccountFind }),
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        else {
          userNameInput.classList.add("error");
          return response.json().then((data) => {
            throw new Error(data.message || "Đã có lỗi xảy ra");
          });
        }
      })
      .then(function (data) {
        btnActiveFind.classList.add("hidden");

        let newPasswordInput = document.querySelector(".new-password");
        let confirmPasswordInput = document.querySelector(
          ".confirm-new-password"
        );
        let saveButton = document.querySelector(".btn-save-password");
        newPasswordInput.classList.remove("hidden");
        confirmPasswordInput.classList.remove("hidden");
        saveButton.classList.remove("hidden");
        // Khóa ô nhập liệu
        userNameInput.disabled = true;
      })
      .catch(function (error) {
        console.error(error);
        alert(error.message || "Đã xảy ra lỗi khi tìm tài khoản");
      });
  });
}

// Lưu mật khẩu mới
function btnSaveNewPassword() {
  let btnActiveSave = document.querySelector(".btn-save-password");

  if (btnActiveSave === null) {
    return;
  }

  let newPasswordInput = document.querySelector(".new-password input");
  let confirmPasswordInput = document.querySelector(
    ".confirm-new-password  input"
  );

  onlyNumber(newPasswordInput);
  onlyNumber(confirmPasswordInput);
  noSpace(newPasswordInput);
  noSpace(confirmPasswordInput);

  btnActiveSave.addEventListener("click", async (e) => {
    const newPasswordValue = newPasswordInput.value;
    const confirmPasswordValue = confirmPasswordInput.value;

    if (newPasswordValue === "" || confirmPasswordValue === "") {
      newPasswordInput.classList.add("error");
      confirmPasswordInput.classList.add("error");
      alert("Vui lòng nhập đủ thông tin");
      return;
    }

    if (newPasswordValue.length !== 6) {
      newPasswordInput.classList.add("error");
      alert("Mật khẩu phải đủ 6 ký tự");
      return;
    }

    if (newPasswordValue !== confirmPasswordValue) {
      newPasswordInput.classList.add("error");
      confirmPasswordInput.classList.add("error");
      alert("Mật khẩu xác nhận không chính xác");
      return;
    }

    fetch("/api/save-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nameAccountFind, newPasswordValue }),
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        else {
          newPasswordInput.classList.add("error");
          confirmPasswordInput.classList.add("error");
          return response.json();
        }
      })
      .then(function (data) {
        newPasswordInput.classList.remove("error");
        confirmPasswordInput.classList.remove("error");
        alert(data.message + ", trở về trang đăng nhập");

        window.location.href = "/login";
      })
      .catch(function (error) {
        console.error(error);
        alert(error.message || "Đã xảy ra lỗi khi lưu mật khẩu");
      });
  });
}

// Chỉ cho phép nhận số
function onlyNumber(input) {
  input.addEventListener("keypress", (event) => {
    const key = event.key;

    if (!/[0-9]/.test(key)) {
      event.preventDefault();
    }
  });
}

// Không cho phép nhận số
function noNumber(input) {
  input.addEventListener("keypress", (event) => {
    const key = event.key;

    if (/[0-9]/.test(key)) {
      event.preventDefault();
    }
  });
}

// Không cho phép nhận phím cách
function noSpace(input) {
  input.addEventListener("keypress", (event) => {
    const key = event.key;

    if (key === " ") {
      event.preventDefault();
    }
  });
}

// Định dạng email

// Main
removeError();
btnLogin();
btnRegister();
btnFindAccount();
btnSaveNewPassword();
