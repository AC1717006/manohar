"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: path_1.default.join(__dirname, "..", "..", "uploads"),
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, name);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed"));
        }
        cb(null, true);
    },
});
router.post("/", auth_1.requireAdmin, upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    res.status(201).json({ url: `/uploads/${req.file.filename}` });
});
exports.default = router;
