const express = require("express");
const router = express.Router();
const multerMiddleware = require("../middleware/multer");
const protect = require("../middleware/authorize");
const {
  uploadPdf,
  extractPages,
  listSavedPdfFiles,
  deletePdf,
} = require("../controller/pdf");

router.post("/upload", protect, multerMiddleware.single("pdf"), uploadPdf);
router.post("/extract", protect, extractPages);
router.get("/list", protect, listSavedPdfFiles);
router.post("/delete", protect, deletePdf);

module.exports = router;
