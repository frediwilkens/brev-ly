import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/infra/db";
import { schemas } from "@/infra/db/schemas";

const deleteShortUrlInput = z.object({
  shortCode: z
    .string()
    .max(32)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Short code must contain only lowercase letters, numbers and single hyphens between them"
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
