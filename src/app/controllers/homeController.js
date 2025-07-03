// const homeModel = require("../models/homeModel.js");

const renderHome = function (req, res) {
  res.render("home", { layout: "dashboard" });
};

module.exports = { renderHome };
