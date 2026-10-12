import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/infra/db";
import { schemas } from "@/infra/db/schemas";

const createShortUrlInput = z.object({
  originalUrl: z.url(),
  shortCode: z
    .string()
    .regex(
      /^[a-z0-9]+$/,
      "Short code must contain only lowercase letters and numbers"
    ),
});

type CreateShortUrlInput = z.input<typeof createShortUrlInput>;
type CreateShortUrlOutput = {
  id: string;
  shortCode: string;
  originalUrl: string;
  accessCount: number;
  createdAt: Date;
};

export async function createShortUrl(
  input: CreateShortUrlInput
): Promise<CreateShortUrlOutput> {
  const { originalUrl, shortCode } = createShortUrlInput.parse(input);

  const [existingRecord] = await db
    .select({
      shortCode: schemas.shortUrls.shortCode,
    })
    .from(schemas.shortUrls)
    .where(eq(schemas.shortUrls.shortCode, shortCode));

  if (existingRecord) {
    throw new Error("Short code already exists");
  }

  const [insertedRow] = await db
    .insert(schemas.shortUrls)
    .values({
      shortCode,
      originalUrl,
    })
    .returning();

  return {
    id: insertedRow.id,
    shortCode,
    originalUrl,
    accessCount: insertedRow.accessCount,
    createdAt: insertedRow.createdAt,
  };
}
