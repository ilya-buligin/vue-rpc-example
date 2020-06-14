import HTTPTransport from "./server-http-transport";

export interface ITransport {
  start(options?: Object): Promise<void>;
  setRequestHandler(handler);
}

export type RPCRequest = {
  jsonrpc: string;
  params?: object;
  method: string;
  id: string | number | null;
};

export type RPCResponse = {
  jsonrpc: string;
  result?: object;
  error?: {
    code: number;
    message: string;
    data?: object;
  };
  id: string | number | null;
};

export type ServerOptions<T> = {
  transport?: ITransport;
  transportOptions?: any;
  methods: T;
};

export interface IServer {
  transport: ITransport;
  methods: any;
  
}

export class Server<T extends object> implements IServer {
  public transport: ITransport;
  public methods: T;

  constructor(options?: ServerOptions<T>) {
    this.transport =
      options?.transport || new HTTPTransport(options?.transportOptions);
    this.methods = options.methods;
  }

  public async start() {
    this.transport.setRequestHandler(this.handler.bind(this));
    await this.transport.start(this);
  }

  private async handler(params: object): Promise<RPCResponse | RPCResponse[]> {
    const requests = params instanceof Array ? params : [params];

    const results = await Promise.all(
      requests.map(
        async (req): Promise<RPCResponse> => {
          const isValid = this.isRequestValid(req);
          if (!isValid) {
            return {
              jsonrpc: "2.0",
              error: {
                code: -32600,
                message: "Invalid Request"
              },
              id: null
            };
          }

          const isExist = this.isMethodExist(req.method);
          if (!isExist) {
            return {
              jsonrpc: "2.0",
              error: {
                code: -32601,
                message: "Method not found"
              },
              id: null
            };
          }

          let result;
          try {
            result = await this.methods[req.method]();
          } catch (error) {
            return {
              jsonrpc: "2.0",
              error: {
                code: -32603,
                message: "Internal error"
              },
              id: null
            };
          }

          return {
            jsonrpc: "2.0",
            result,
            id: req.id ?? null
          };
        }
      )
    );

    return results.length > 1 ? results : results[0];
  }

  private isRequestValid(object): boolean {
    const isJsonrpc = object?.jsonrpc === "2.0";
    const isMethod = typeof object?.method === "string";
    const isParmas =
      typeof object?.params === "object" ||
      typeof object?.params === "undefined";
    const isId =
      ["undefined", "number", "string"].includes(typeof object?.id) ||
      object?.id === null;

    return isJsonrpc && isMethod && isParmas && isId;
  }

  private isMethodExist(method: string): boolean {
    return this.methods.hasOwnProperty(method);
  }
}
