import { randomUUID } from "node:crypto";
import type { InferInsertModel } from "drizzle-orm";
import { db } from "@/infra/db";
import { schemas } from "@/infra/db/schemas";

export async function addShortUrl(
  overrides?: Partial<InferInsertModel<typeof schemas.shortUrls>>
) {
  const randomShortCode = randomUUID().slice(0, 4);

  const result = await db
    .insert(schemas.shortUrls)
    .values({
      originalUrl: "http://test.com",
      shortCode: `${randomShortCode}`,
      ...overrides,
    })
    .returning();

  return result[0];
}
