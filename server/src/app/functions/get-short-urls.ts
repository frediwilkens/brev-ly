import { asc, count, desc, eq, ilike } from "drizzle-orm";
import z from "zod";
import { db } from "@/infra/db";
import { schemas } from "@/infra/db/schemas";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

const getShortUrlsInput = z.object({
  searchQuery: z.string().optional(),
  sortBy: z.enum(["createdAt"]).optional(),
  sortDirection: z.enum(["asc", "desc"]).optional(),
  page: z.number().optional().default(DEFAULT_PAGE),
  pageSize: z.number().optional().default(DEFAULT_PAGE_SIZE),
});
const getShortUrlByShortCodeInput = z.object({ shortCode: z.string() });

type GetShortUrlsInput = z.input<typeof getShortUrlsInput>;
type GetShortUrlsOutput = {
  shortUrls: {
    id: string;
    originalUrl: string;
    shortCode: string;
    accessCount: number;
    createdAt: Date;
  }[];
  totalCount: number;
};
type GetShortUrlsByShortCodeInput = z.input<typeof getShortUrlByShortCodeInput>;
type GetShortUrlsByShortCodeOutput = {
  shortUrl: {
    id: string;
    originalUrl: string;
    shortCode: string;
    accessCount: number;
    createdAt: Date;
  };
};

export async function getShortUrls(
  input: GetShortUrlsInput
): Promise<GetShortUrlsOutput> {
  const { page, pageSize, searchQuery, sortBy, sortDirection } =
    getShortUrlsInput.parse(input);

  const [shortUrls, [{ totalCount }]] = await Promise.all([
    db
      .select({
        id: schemas.shortUrls.id,
        originalUrl: schemas.shortUrls.originalUrl,
        shortCode: schemas.shortUrls.shortCode,
        accessCount: schemas.shortUrls.accessCount,
        createdAt: schemas.shortUrls.createdAt,
      })
      .from(schemas.shortUrls)
      .where(
        searchQuery
          ? ilike(schemas.shortUrls.shortCode, `%${searchQuery}%`)
          : undefined
      )
      .orderBy((fields) => {
        if (sortBy && sortDirection === "asc") {
          return asc(fields[sortBy]);
        }

        if (sortBy && sortDirection === "desc") {
          return desc(fields[sortBy]);
        }

        return desc(fields.id);
      })
      .offset((page - 1) * pageSize)
      .limit(pageSize),
    db
      .select({ totalCount: count(schemas.shortUrls.id) })
      .from(schemas.shortUrls)
      .where(
        searchQuery
          ? ilike(schemas.shortUrls.shortCode, `%${searchQuery}%`)
          : undefined
      ),
  ]);

  return { shortUrls, totalCount };
}

export async function getShortUrlByShortCode(
  input: GetShortUrlsByShortCodeInput
): Promise<GetShortUrlsByShortCodeOutput> {
  const { shortCode } = getShortUrlByShortCodeInput.parse(input);

  const [shortUrl] = await db
    .select({
      id: schemas.shortUrls.id,
      shortCode: schemas.shortUrls.shortCode,
      originalUrl: schemas.shortUrls.originalUrl,
      accessCount: schemas.shortUrls.accessCount,
      createdAt: schemas.shortUrls.createdAt,
    })
    .from(schemas.shortUrls)
    .where(eq(schemas.shortUrls.shortCode, shortCode));

  if (!shortUrl) {
    throw new Error("ShortUrl not found");
  }

  return { shortUrl };
}
