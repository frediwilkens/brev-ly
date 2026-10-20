import { PassThrough, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { stringify } from "csv-stringify";
import { ilike } from "drizzle-orm";
import { z } from "zod";
import { db, pg } from "@/infra/db";
import { schemas } from "@/infra/db/schemas";
import { env } from "@/infra/env";
import { uploadFileToStorage } from "@/infra/storage/upload-file-to-storage";

const exportShortUrlsInput = z.object({
	searchQuery: z.string().optional(),
});

type ExportShortUrlsInput = z.input<typeof exportShortUrlsInput>;

type ExportShortUrlsOutput = {
	reportUrl: string;
};

export async function exportShortUrls(
	input: ExportShortUrlsInput,
): Promise<ExportShortUrlsOutput> {
	const { searchQuery } = exportShortUrlsInput.parse(input);

	const { sql, params } = db
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
				? ilike(schemas.shortUrls.originalUrl, `%${searchQuery}%`)
				: undefined,
		)
		.toSQL();

	const cursor = pg.unsafe(sql, params as string[]).cursor(env.CSV_BATCH_SIZE);

	const csv = stringify({
		delimiter: ",",
		header: true,
		columns: [
			{ key: "id", header: "ID" },
			{ key: "original_url", header: "ORIGINAL URL" },
			{ key: "short_code", header: "URL ENCURTADA" },
			{ key: "access_count", header: "ACESSOS" },
			{ key: "created_at", header: "CRIADO EM" },
		],
	});

	const shortURlToStorageStream = new PassThrough();

	const convertToCSVPipeline = pipeline(
		cursor,
		new Transform({
			objectMode: true,
			transform(chunks: unknown[], _encoding, callback) {
				for (const chunk of chunks) {
					this.push(chunk);
				}

				callback();
			},
		}),
		csv,
		shortURlToStorageStream,
	);

	const uploadCsvToStorage = uploadFileToStorage({
		folder: "reports",
		contentType: "text/csv",
		fileName: `${new Date().toISOString()}-short-links.csv`,
		contentStream: shortURlToStorageStream,
	});

	const [{ url }] = await Promise.all([
		uploadCsvToStorage,
		convertToCSVPipeline,
	]);

	return {
		reportUrl: url,
	};
}
