import express from "express";
import * as BankId from "bankid";

const client = new BankId.BankIdClient();
const pno = "196210156342";

const app = express();
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
  res.send("Hello Typescript!");
});

export default app;