import express from 'express';
import * as BankId from 'bankid';

import bodyParser from 'body-parser';

import path from 'node:path';

// Here we are configuring express to use body-parser as middle-ware.
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const client = new BankId.BankIdClient();

app.get('/auth', (req, res) => {
  client
    .authenticateAndCollect({
      personalNumber: req.body?.pno ?? '196210156342',
      endUserIp: '127.0.0.1',
    })
    .then((r) => console.log(r.completionData))
    .catch(console.error);

  res.send('authenticated');
});

app.get('/', (request, response) => {
  response.sendFile(path.join(`${__dirname}/index.html`));
});

app.post('/login', (request, response) => {
  const { ssn } = request.body;
  response.send('yes');
});

export default app;
