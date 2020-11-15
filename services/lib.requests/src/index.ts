import Got from "got";
import { Method } from "got";
import { IncomingMessage as LibIncomingMessage, ServerResponse } from "http";
import {
  router,
  del,
  get,
  post,
  put,
  AugmentedRequestHandler,
} from "microrouter";
import { send } from "micro";
import { StatusCodes } from "http-status-codes";

type RequestParameters = {
  service?: string;
  method: Method;
  route: string;
  handler: AugmentedRequestHandler;
};

// Just an alias.
export type Route = RequestParameters;

export interface IncomingMessage extends LibIncomingMessage {
  got: typeof Got;
}

export function makeRequest<Request, Response>(
  routes: Array<Route>,
  opts: RequestParameters
) {
  routes.push(opts);
  return {
    ...opts,
    async send(ctx: IncomingMessage, input: Request): Promise<Response> {
      const { got } = ctx;

      if (!opts.service) throw new Error("Service undefined");

      return got(`${opts.service}/${opts.route}`, {
        method: opts.method,
        json: { ...input },
      }).json();
    },
  };
}

export function makeRouter(routes: Array<Route>) {
  return router(
    ...routes.map(({ method, route, handler }) => {
      switch (method.toUpperCase()) {
        case "GET":
          return get(route, handler);
        case "PUT":
          return put(route, handler);
        case "POST":
          return post(route, handler);
        case "DELETE":
          return del(route, handler);
        default:
          return (req: LibIncomingMessage, res: ServerResponse) =>
            send(res, StatusCodes.METHOD_NOT_ALLOWED);
      }
    }),
    get("/*", (req: LibIncomingMessage, res: ServerResponse) =>
      send(res, StatusCodes.NOT_FOUND)
    )
  );
}
