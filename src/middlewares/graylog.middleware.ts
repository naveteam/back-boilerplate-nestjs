import { Request, Response } from 'express';
import { GrayLogger } from '../helpers/graylog/graylog';

const graylog = new GrayLogger();

// eslint-disable-next-line @typescript-eslint/ban-types
export function graylogMiddleware(req: Request, res: Response, next: Function) {
  const prettyReq = {
    url: req.url,
    baseUrl: req.baseUrl,
    originalUrl: req.originalUrl,
    query: req.query,
    params: req.params,
    headers: req.headers,
    ip: req.ip,
    method: req.method,
    body: req.body,
  };

  const prettyRes = {
    statusCode: res.statusCode,
    statusMessage: res.statusMessage,
  };

  graylog.log(JSON.stringify({ req: prettyReq, res: prettyRes }, null, 2));
  next();
}
