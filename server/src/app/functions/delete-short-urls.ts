import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/infra/db";
import { schemas } from "@/infra/db/schemas";

const deleteShortUrlInput = z.object({
  shortCode: z
    .string()
    .regex(
      /^[a-z0-9]+$/,
      "Short code must contain only lowercase letters and numbers"
    ),
});

type DeleteShortUrlInput = z.input<typeof deleteShortUrlInput>;

export async function deleteShortUrl(
  input: DeleteShortUrlInput
): Promise<void> {
  const { shortCode } = deleteShortUrlInput.parse(input);

  await db
    .delete(schemas.shortUrls)
    .where(eq(schemas.shortUrls.shortCode, shortCode));
}
