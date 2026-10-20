import { z } from "zod";
import { env } from "../config/env";
import type { ShortLink, ShortLinksPage } from "../types/short-link";

const apiShortLinkSchema = z.object({
	id: z.string(),
	shortCode: z.string(),
	originalUrl: z.url(),
	accessCount: z.number().optional().default(0),
	createdAt: z.iso
		.datetime()
		.or(z.date())
		.transform((date) => (date instanceof Date ? date.toISOString() : date)),
});

const shortLinksPageSchema = z.object({
	shortUrls: z.array(apiShortLinkSchema),
	totalCount: z.number(),
});

const shortLinkResponseSchema = z.object({ shortUrl: apiShortLinkSchema });
const createShortLinkResponseSchema = z.object({
	id: z.string(),
	shortCode: z.string(),
	originalUrl: z.url(),
});

export class ApiError extends Error {
	public readonly status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
}

async function request(path: string, init?: RequestInit): Promise<Response> {
	const response = await fetch(`${env.VITE_BACKEND_URL}${path}`, {
		...init,
		headers: {
			...(init?.body ? { "Content-Type": "application/json" } : {}),
			...init?.headers,
		},
	});

	if (!response.ok) {
		let message = `A API retornou um erro (${response.status}).`;
		try {
			const body: unknown = await response.json();
			if (
				typeof body === "object" &&
				body !== null &&
				"message" in body &&
				typeof body.message === "string"
			) {
				message = body.message;
			}
		} catch {
			// Respostas sem JSON usam a mensagem genérica acima.
		}
		throw new ApiError(message, response.status);
	}

	return response;
}

export async function getShortLinks(
	signal?: AbortSignal,
): Promise<ShortLinksPage> {
	const pageSize = 100;
	const firstResponse = await request(
		`/shortUrls?page=1&pageSize=${pageSize}`,
		{ signal },
	);
	const firstPage = shortLinksPageSchema.parse(await firstResponse.json());
	const shortUrls = [...firstPage.shortUrls];
	const pageCount = Math.ceil(firstPage.totalCount / pageSize);

	for (let page = 2; page <= pageCount; page += 1) {
		const response = await request(
			`/shortUrls?page=${page}&pageSize=${pageSize}`,
			{ signal },
		);
		const result = shortLinksPageSchema.parse(await response.json());
		shortUrls.push(...result.shortUrls);
	}

	return {
		shortUrls,
		totalCount: firstPage.totalCount,
	} satisfies ShortLinksPage;
}

export async function getShortLink(
	shortCode: string,
	signal?: AbortSignal,
): Promise<ShortLink> {
	const response = await request(
		`/shortUrls/${encodeURIComponent(shortCode)}`,
		{ signal },
	);
	const result = shortLinkResponseSchema.parse(await response.json());
	return result.shortUrl;
}

export async function createShortLink(input: {
	originalUrl: string;
	shortCode: string;
}): Promise<void> {
	const response = await request("/shortUrl", {
		method: "POST",
		body: JSON.stringify(input),
	});
	createShortLinkResponseSchema.parse(await response.json());
}

export async function deleteShortLink(shortCode: string): Promise<void> {
	await request(`/shortUrl/${encodeURIComponent(shortCode)}`, {
		method: "DELETE",
	});
}

const exportResponseSchema = z.object({ reportUrl: z.url() });

export async function exportShortLinks(): Promise<string> {
	const response = await request("/shortUrls/export", { method: "POST" });
	return exportResponseSchema.parse(await response.json()).reportUrl;
}

export function getAccessUrl(shortCode: string): string {
	return `${env.VITE_BACKEND_URL}/${encodeURIComponent(shortCode)}`;
}
