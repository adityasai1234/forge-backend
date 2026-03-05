"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const analyze_1 = __importDefault(require("./routes/analyze"));
dotenv_1.default.config({ path: '.env.local' });
const app = (0, express_1.default)();
const port = process.env.PORT || 8321;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'forge-backend' });
});
app.use('/analyze', analyze_1.default);
app.listen(port, () => {
    console.log(`Forge backend running on port ${port}`);
});
