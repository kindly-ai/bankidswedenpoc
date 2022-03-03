import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getJwtFromRequest, issueKindlyChatJWT, LocalAppJWT } from './jwt';

export default function chatbubbleAuth(req: Request, res: Response): void {
  const localAppJWT = getJwtFromRequest(req) as LocalAppJWT;
  const chatId = req.body.chat_id;

  if (!chatId) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: 'Missing chat_id' });
    return;
  }

  const kindlyChatJWT = issueKindlyChatJWT(localAppJWT, chatId);
  res.send({ token: kindlyChatJWT });
}
