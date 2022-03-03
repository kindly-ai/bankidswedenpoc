import * as BankId from 'bankid';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { issueLocalJWT } from './jwt';

const client = new BankId.BankIdClient();

function ipv4FromRequest(req: Request): string {
  const IP_PREFIX = '::ffff:';

  if (req.ip.startsWith(IP_PREFIX)) {
    return req.ip.replace(IP_PREFIX, '');
  }

  return req.ip;
}

export default async function route(req: Request, res: Response): Promise<void> {
  const {
    body: { pno },
  } = req;

  if (!pno) {
    throw new Error('Missing required pno');
  }

  const parameters = {
    personalNumber: String(pno),
    endUserIp: ipv4FromRequest(req),
  };

  try {
    const { status, completionData } = await client.authenticateAndCollect(parameters);

    if (status !== 'complete') {
      throw new Error(`Error during auth, status: ${status}`);
    }

    assert(completionData?.user !== undefined);

    const token = issueLocalJWT(completionData.user);

    res.status(StatusCodes.OK).send({ token });
  } catch (error) {
    console.error(error);

    if ((error as Record<string, string>)?.status) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    }

    assert(error instanceof Error);
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
}
