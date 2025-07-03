// Lay ten dang nhap

function getUserNameFromLogin() {
  const userName = sessionStorage.getItem("userName");
  let nameAccount = document.querySelector(".account");
  nameAccount.innerText = userName;
}

// Button logout
function logoutButton() {
  let btnActive = document.querySelector(".logout");

  btnActive.onclick = function () {
    var result = confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (result) {
      window.location.href = "/login";
      sessionStorage.removeItem("userName");
    }
  };
}

logoutButton();
getUserNameFromLogin();
