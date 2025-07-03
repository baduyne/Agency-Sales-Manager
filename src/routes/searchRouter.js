const express = require("express");
const searchController = require("../app/controllers/searchController.js");
const router = express.Router();

// api
router.get("/search/api", searchController.rederSearch);

//reder
router.get("/search", searchController.index);

module.exports = router;
