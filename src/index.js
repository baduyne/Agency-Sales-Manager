const express = require("express");
const port = 3000;
const morgan = require("morgan");
const handlebars = require("express-handlebars");
const path = require("path");
const app = express();

// Import Routes
const loginRouter = require("./routes/loginPageRoutes/loginRouter.js");
const registerRouter = require("./routes/loginPageRoutes/registerRouter.js");
const forgetPasswordRouter = require("./routes/loginPageRoutes/forgetPasswordRouter.js");
const homeRouter = require("./routes/homeRouter.js");
const searchRouter = require("./routes/searchRouter.js");
const importRouter = require("./routes/importRouter.js");
const exportRouter = require("./routes/exportRouter.js");
const receiptRouter = require("./routes/receiptRouter.js");
const reportRouter = require("./routes/reportRouter.js");
const settingRouter = require("./routes/settingRouter.js");

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Template engine
app.engine(
  "handlebars",
  handlebars.engine({
    layoutsDir: path.join(__dirname, "resources", "views", "layouts"), // Không thêm src vào đây nữa
    partialsDir: path.join(__dirname, "resources", "views", "partials"), // Cũng không thêm src vào đây
  })
);
app.set("view engine", "handlebars");
app.set("views", "src/resources/views");

// --------Routes--------
// Login page
app.use("/", loginRouter);
app.use("/", registerRouter);
app.use("/", forgetPasswordRouter);

// Dashboard page
app.use("/", homeRouter);
app.use("/", searchRouter);
app.use("/", importRouter);
app.use("/", exportRouter);
app.use("/", receiptRouter);
app.use("/", reportRouter);
app.use("/", settingRouter);

// Listen
app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}/login`);
});
