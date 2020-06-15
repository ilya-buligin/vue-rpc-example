import express from "express";
import { Express, Request, Response } from "express";
import bodeParser from "body-parser";
import cors from "cors";

import {
  Server,
  ITransport,
  RPCResponse,
  RPCRequest,
  IHandler
} from "./server";

export type HTTPTransportOptions = {
  path: string;
  port: number;
};

export default class HTTPTransport implements ITransport {
  public path: string;
  public port: number;

  private express: Express;
  private serverHandler!: IHandler;

  constructor(options?: HTTPTransportOptions) {
    this.path = options?.path || "/rpc";
    this.port = options?.port || 3000;
    this.express = express();
  }

  public setRequestHandler(handler: IHandler) {
    this.serverHandler = handler;
  }

  public async start() {
    this.setMiddlewares();
    this.express.post(this.path, this.handler.bind(this));

    await this.express.listen(this.port);
  }

  private setMiddlewares() {
    this.express.use(cors());
    this.express.use(bodeParser.raw({ type: "*/*" }));
  }

  private async handler(req: Request, res: Response) {
    let body;
    try {
      body = JSON.parse(req.body);
    } catch {
      res.send({
        jsonrpc: "2.0",
        error: {
          code: -32700,
          message: "Parse error"
        },
        id: null
      });
      return;
    }

    const resData = await this.serverHandler(body);
    res.send(resData);
  }
}
