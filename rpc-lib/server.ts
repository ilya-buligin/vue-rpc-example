import HTTPTransport from "./server-http-transport";

export interface ITransport {
  start(options?: Object): Promise<void>;
  setRequestHandler(handler: IHandler): void;
}

export interface IHandler {
  (req: RPCRequest | RPCRequest[]): Promise<RPCResponse | RPCResponse[]>;
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

export interface IMethodsBase {
  [key: string]: (params: any | void) => Promise<any | void>;
}

export class Server<T extends IMethodsBase> implements IServer {
  public transport: ITransport;
  public methods: T;

  constructor(options: ServerOptions<T>) {
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
        async (req: RPCRequest): Promise<RPCResponse> => {
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

          const method = req.method;

          const isExist = this.isMethodExist(method);
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
            result = await this.executeMethod(method, req.params);
          } catch (error) {
            console.error(error);
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

  private isRequestValid(object: RPCRequest): boolean {
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

  private async executeMethod(method: string, params?: object) {
    return await this.methods[method](params);
  }
}
