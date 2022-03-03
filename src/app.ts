import express from 'express';
import passport from 'passport';
import path from 'node:path';
import bankid from './bankid';
import { jwtStrategy } from './jwt';
import chatbubble from './chatbubble';

passport.use(jwtStrategy);

const app = express();
app.use(express.json());

app.post('/bankid-auth', bankid);
app.post('/chatbubble-auth', passport.authenticate('jwt', { session: false }), chatbubble);
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

export default app;
