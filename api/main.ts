import { Server } from "../rpc-lib/server";

import { $Methods } from "./shared";
import { methods } from "./rpc";

const server = new Server<$Methods>({ methods });

server.start();
