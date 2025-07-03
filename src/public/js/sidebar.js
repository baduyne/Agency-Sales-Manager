// Kiểm tra active của trang
function pageActive() {
  document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname;
    const parts = currentPath.split("/");
    const active = parts[parts.length - 1];

    document.querySelector(`.sb-${active}`).classList.add("page-focus");
  });
}

// Chuyển focus
function changePage(btnClass) {
  let pageFocusing = document.querySelector(".page-focus");
  pageFocusing.classList.remove("page-focus");

  let btnActive = document.querySelector(btnClass);
  btnActive.classList.add("page-focus");
}

document.querySelector(".sb-home").onclick = function () {
  changePage(".sb-home");
  window.location.href = "/home";
};
document.querySelector(".sb-search").onclick = function () {
  changePage(".sb-search");
  window.location.href = "/search";
};
document.querySelector(".sb-import").onclick = function () {
  changePage(".sb-import");
  window.location.href = "/import";
};
document.querySelector(".sb-export").onclick = function () {
  changePage(".sb-export");
  window.location.href = "/export";
};
document.querySelector(".sb-receipt").onclick = function () {
  changePage(".sb-receipt");
  window.location.href = "/receipt";
};
document.querySelector(".sb-report").onclick = function () {
  changePage(".sb-report");
  window.location.href = "/report";
};
document.querySelector(".sb-settings").onclick = function () {
  changePage(".sb-settings");
  window.location.href = "/settings";
};

pageActive();
