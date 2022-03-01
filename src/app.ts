import express from 'express';
import * as BankId from 'bankid';

const client = new BankId.BankIdClient();

const app = express();
app.get('/auth', (req, res) => {
  client
    .authenticateAndCollect({
      personalNumber: req.body.pno ?? '196210156342',
      endUserIp: '127.0.0.1',
    })
    .then((r) => console.log(r.completionData))
    .catch(console.error);

  res.send('auth!');
});

app.get('/', (request, response) => {
  response.send('Hello Typescript!');
});

export default app;
