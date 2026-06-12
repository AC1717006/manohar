"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const auth_1 = __importDefault(require("./routes/auth"));
const products_1 = __importDefault(require("./routes/products"));
const categories_1 = __importDefault(require("./routes/categories"));
const orders_1 = __importDefault(require("./routes/orders"));
const customers_1 = __importDefault(require("./routes/customers"));
const admin_1 = __importDefault(require("./routes/admin"));
const uploads_1 = __importDefault(require("./routes/uploads"));
const app = (0, express_1.default)();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
app.use((0, cors_1.default)({ origin: process.env.CORS_ORIGIN ?? "*" }));
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "..", "uploads")));
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", auth_1.default);
app.use("/api/products", products_1.default);
app.use("/api/categories", categories_1.default);
app.use("/api/orders", orders_1.default);
app.use("/api/customers", customers_1.default);
app.use("/api/admin", admin_1.default);
app.use("/api/uploads", uploads_1.default);
app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
});
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
