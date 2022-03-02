import express, { Request } from 'express';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import path from 'node:path';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import bankid from './bankid';
import { HS256_SECRET, issueKindlyChatJWT, LocalAppJWT } from './jwt';

const jwtFinder = ExtractJwt.fromAuthHeaderAsBearerToken();

function getJwtFromReq(req: Request): JwtPayload {
  const encoded = jwtFinder(req);
  if (!encoded) {
    throw new Error('JWT not found');
  }

  return jwt.decode(encoded) as JwtPayload;
}

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: jwtFinder,
      secretOrKey: HS256_SECRET,
    },
    (jwtPayload, done) => {
      console.log(jwtPayload);
      return done(undefined, jwtPayload);
    }
  )
);

// Here we are configuring express to use body-parser as middle-ware.
const app = express();
app.use(express.json());

app.post('/bankid-auth', bankid);

app.post('/chatbubble-auth', passport.authenticate('jwt', { session: false }), (req, res) => {
  const localAppJWT = getJwtFromReq(req) as LocalAppJWT;
  const chatId = req.body.chat_id;

  if (!chatId) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: 'Missing chat_id' });
    return;
  }

  const kindlyChatJWT = issueKindlyChatJWT(localAppJWT, chatId);
  res.send({ token: kindlyChatJWT });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

export default app;
