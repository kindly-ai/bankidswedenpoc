"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
const BankId = require("bankid");
const client = new BankId.BankIdClient();
const pno = "196210156342";
app.get("/auth", (req, res) => {
    client
        .authenticateAndCollect({
        personalNumber: pno,
        endUserIp: "127.0.0.1",
    })
        .then((res) => console.log(res.completionData))
        .catch(console.error);
    res.send("auth!");
});
app.get("/", (req, res) => {
    res.send("Hello typescript World!");
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map