import { eq, sql } from "drizzle-orm";
import z from "zod";
import { db } from "@/infra/db";
import { schemas } from "@/infra/db/schemas";

const accessShortUrlInput = z.object({
	shortCode: z
		.string()
		.max(32)
		.regex(
			/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
			"Short code must contain only lowercase letters, numbers and single hyphens between them",
		),
});

type AccessShortUrlInput = z.input<typeof accessShortUrlInput>;

export async function accessShortUrl(
	input: AccessShortUrlInput,
): Promise<string> {
	const { shortCode } = accessShortUrlInput.parse(input);

	const [shortUrl] = await db
		.update(schemas.shortUrls)
		.set({
			accessCount: sql`${schemas.shortUrls.accessCount} + 1`,
		})
		.where(eq(schemas.shortUrls.shortCode, shortCode))
		.returning({ originalUrl: schemas.shortUrls.originalUrl });

	if (!shortUrl) {
		throw new Error("Short URL not found");
	}

	return shortUrl.originalUrl;
}
