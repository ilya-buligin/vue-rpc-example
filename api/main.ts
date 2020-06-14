import { Server } from "../rpc-lib/server";

import { IMethods } from "./shared";
import methods from "./rpc";

const server = new Server<IMethods>({
  methods
});

server.start();
