const fs = require("fs");
const Pdf = require("../model/Pdf");
const { PDFDocument } = require("pdf-lib");
const { verifyToken } = require("../middleware/jwtGenerate");

const uploadPdf = async (req, res) => {
  try {
    const user = verifyToken(req.headers.authorization.split(" ")[1]).id;
    const fileName = req.file.originalname;
    const filePath = `./uploads/${fileName}`;

    // Ensure that the uploads directory exists
    if (!fs.existsSync("./uploads")) {
      fs.mkdirSync("./uploads");
    }

    fs.writeFileSync(filePath, req.file.buffer);

    // Save uploaded PDF information to database
    const newPdf = new Pdf({
      user: user,
      fileName: fileName,
      filePath: filePath,
      extractedPages: [],
    });

    await newPdf.save();

    res.status(200).json({
      status: "success",
      message: "PDF file uploaded successfully",
      data: {
        pdfId: newPdf._id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Failed to upload PDF file",
    });
  }
};

const extractPages = async (req, res) => {
  try {
    const { pdfId, selectedPages } = req.body;

    // Retrieve PDF file path from database
    const pdf = await Pdf.findById(pdfId);

    if (!pdf) {
      return res.status(404).json({
        status: "error",
        message: "PDF file not found",
      });
    }

    const existingPdf = await PDFDocument.load(fs.readFileSync(pdf.filePath));
    const newPdf = await PDFDocument.create();

    // Extract selected pages from original PDF and add to new PDF
    for (const pageNumber of selectedPages) {
      const [copiedPage] = await newPdf.copyPages(existingPdf, [
        pageNumber - 1,
      ]);
      newPdf.addPage(copiedPage);
    }

    const newPdfBytes = await newPdf.save();

    // Save new PDF file
    const newFilePath = `./uploads/extracted_${pdfId}.pdf`;
    fs.writeFileSync(newFilePath, newPdfBytes);

    // Update extracted pages information in database
    await Pdf.findByIdAndUpdate(pdfId, {
      $push: { extractedPages: selectedPages },
    });

    res.status(200).json({
      status: "success",
      message: "PDF pages extracted successfully",
      data: {
        extractedPdfPath: newFilePath,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Failed to extract pages from PDF",
    });
  }
};

const listSavedPdfFiles = async (req, res) => {
  try {
    const user = verifyToken(req.headers.authorization.split(" ")[1]).id;

    // Find saved PDF files for the logged-in user
    const savedPdfFiles = await Pdf.find({ user: user });

    res.status(200).json({
      status: "success",
      message: "Saved PDF files retrieved successfully",
      data: {
        savedPdfFiles: savedPdfFiles,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve saved PDF files",
    });
  }
};
module.exports = { uploadPdf, extractPages, listSavedPdfFiles };
