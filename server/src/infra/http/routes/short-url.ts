import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { accessShortUrl } from "@/app/functions/access-short-urls";
import { createShortUrl } from "@/app/functions/create-short-urls";
import { deleteShortUrl } from "@/app/functions/delete-short-urls";
import {
  getShortUrlByShortCode,
  getShortUrls,
} from "@/app/functions/get-short-urls";

export const shortUrlRoutes: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/shortUrl",
    {
      schema: {
        summary: "Create a new short URL",
        body: z.object({
          originalUrl: z.url(),
          shortCode: z
            .string()
            .regex(
              /^[a-z0-9]+$/,
              "Short code must contain only lowercase letters and numbers"
            ),
        }),
        response: {
          201: z.object({
            id: z.string(),
            shortCode: z.string(),
            originalUrl: z.url(),
          }),
          409: z
            .object({ message: z.string() })
            .describe("short URL already exists"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, shortCode } = request.body;

      try {
        const newShortUrl = await createShortUrl({ originalUrl, shortCode });

        return reply.status(201).send(newShortUrl);
      } catch (err) {
        if (
          err instanceof Error &&
          err.message === "Short code already exists"
        ) {
          return reply.status(409).send({ message: err.message });
        }
        console.log(err);
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );

  server.delete(
    "/shortUrl/:shortCode",
    {
      schema: {
        summary: "Delete a short URL",
        params: z.object({
          shortCode: z
            .string()
            .regex(
              /^[a-z0-9]+$/,
              "Short code must contain only lowercase letters and numbers"
            ),
        }),
        response: {
          204: z.null(),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    async (request, reply) => {
      const { shortCode } = request.params;

      try {
        await deleteShortUrl({ shortCode });
      } catch (err) {
        console.log(err);
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );

  server.get(
    "/shortUrls",
    {
      schema: {
        summary: "Get all short URLs",
        querystring: z.object({
          searchQuery: z.string().optional(),
          sortBy: z.enum(["createdAt"]).optional(),
          sortDirection: z.enum(["asc", "desc"]).optional(),
          page: z.coerce.number().optional().default(1),
          pageSize: z.coerce.number().optional().default(20),
        }),
        response: {
          200: z.object({
            shortUrls: z.array(
              z.object({
                id: z.string(),
                shortCode: z.string(),
                originalUrl: z.url(),
                createdAt: z.date(),
              })
            ),
            totalCount: z.number(),
          }),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    async (request, reply) => {
      const { searchQuery, page, pageSize, sortBy, sortDirection } =
        request.query;
      try {
        const { shortUrls, totalCount } = await getShortUrls({
          page,
          pageSize,
          searchQuery,
          sortBy,
          sortDirection,
        });

        return reply.status(200).send({ shortUrls, totalCount });
      } catch (err) {
        console.log(err);
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );

  server.get(
    "/shortUrls/:shortCode",
    {
      schema: {
        summary: "Get a short URL",
        params: z.object({
          shortCode: z
            .string()
            .regex(
              /^[a-z0-9]+$/,
              "Short code must contain only lowercase letters and numbers"
            ),
        }),
        response: {
          200: z.object({
            shortUrl: z.object({
              id: z.string(),
              shortCode: z.string(),
              originalUrl: z.url(),
              accessCount: z.number(),
              createdAt: z.date(),
            }),
          }),
          404: z
            .object({ message: z.string() })
            .describe("Short url not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    async (request, reply) => {
      const { shortCode } = request.params;

      try {
        const { shortUrl } = await getShortUrlByShortCode({ shortCode });

        return reply.status(200).send({ shortUrl });
      } catch (err) {
        if (err instanceof Error && err.message === "ShortUrl not found") {
          return reply.status(404).send({ message: err.message });
        }

        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );

  server.get(
    "/:shortCode",
    {
      schema: {
        summary: "Redirect to the original URL and count the access",
        params: z.object({
          shortCode: z
            .string()
            .regex(
              /^[a-z0-9]+$/,
              "Short code must contain only lowercase letters and numbers"
            ),
        }),
        response: {
          404: z
            .object({ message: z.string() })
            .describe("Short url not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    async (request, reply) => {
      const { shortCode } = request.params;

      try {
        const originalUrl = await accessShortUrl({ shortCode });

        return reply.redirect(originalUrl);
      } catch (err) {
        if (err instanceof Error && err.message === "Short URL not found") {
          return reply.status(404).send({ message: "Short URL not found" });
        }
        console.log(err);
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );
};
