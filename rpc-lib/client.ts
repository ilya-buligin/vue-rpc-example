import { RPCRequest, RPCResponse } from "./server";

export interface IFetcher {
  (data: RPCRequest): Promise<RPCResponse>;
}

export class Client<T> {
  private fetcher: IFetcher;
  private proxy: any;

  constructor(fetcher: IFetcher) {
    this.fetcher = fetcher;
    this.proxy = new Proxy(
      {},
      {
        get: (target, name) => {
          return (params?: object) => this.sendRequest(String(name), params);
        }
      }
    );
  }

  public async sendRequest(method: string, params?: object) {
    const data = await this.fetcher({ jsonrpc: "2.0", id: null, method, params });
    if (typeof data?.result === "object") {
      return data?.result;
    }
  }

  get methods(): T {
    return this.proxy;
  }
}
