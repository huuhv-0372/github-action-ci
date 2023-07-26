import {
  IncomingMessage,
  ServerResponse,
  createServer as createHttpServer,
  Server,
} from 'http';
import { httpLogger } from './logger';

export const createServer = async (
  handleRequest: (
    request: IncomingMessage,
    response: ServerResponse,
  ) => Promise<void>,
): Promise<Server> => {
  return createHttpServer(
    (request: IncomingMessage, response: ServerResponse) => {
      httpLogger(request, response);

      handleRequest(request, response);
    },
  );
};
