import multer from "multer";
import { Employee } from "../models/employee-model";
import express from "express";
import XLSX from "xlsx";

const router = express.Router();

const uploadXLSX = async (req, res) => {
  try {
    const path = req.file.path;
    const salarySheet = XLSX.readFile(path);
    const sheetNameList = salarySheet.SheetNames;
    const jsonData = XLSX.utils.sheet_to_json(
      salarySheet.Sheets[sheetNameList[1]]
    );

    if (jsonData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "xml sheet has no data",
      });
    }
    const savedData = await Employee.create(jsonData);
    return res.status(201).json({
      success: true,
      message: `${savedData.length} rows added to the database`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

router.post("/upload", upload.single("xlsx"), uploadXLSX);

export default router;
