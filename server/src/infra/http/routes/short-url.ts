import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const shortUrlRoutes: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/shortUrl",
    {
      schema: {
        summary: "Create a new short URL",
        body: z.object({
          originalUrl: z.url(),
          shortUrl: z.url(),
        }),
        response: {
          201: z.object({
            _id: z.string(),
            shortUrl: z.url(),
            originalUrl: z.url(),
          }),
          409: z
            .object({ message: z.string() })
            .describe("short URL already exists"),
        },
      },
    },
    async (_request, reply) => {
      return reply.status(201).send({
        _id: "testId",
        shortUrl: "https://test1.com",
        originalUrl: "https://test2.com",
      });
    }
  );
};
