import { randomUUID } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { exportShortUrls } from "@/app/functions/export-short-urls";
import * as uploadToStorage from "@/infra/storage/upload-file-to-storage";
import { addShortUrl } from "@/specs/utils/add-short-urls";

describe("export short URLs report", () => {
  it("should be able to export a short URLs report", async () => {
    const uploadToStorageStub = vi
      .spyOn(uploadToStorage, "uploadFileToStorage")
      .mockImplementationOnce(async () => {
        return {
          key: `${randomUUID()}-unique-file-name`,
          url: "https://storage.com/report",
        };
      });

    const originalUrlPattern = randomUUID();

    const shortURL1 = await addShortUrl({
      originalUrl: `https://${originalUrlPattern}.com`,
    });
    const shortURL2 = await addShortUrl({
      originalUrl: `https://${originalUrlPattern}.com`,
    });
    const shortURL3 = await addShortUrl({
      originalUrl: `https://${originalUrlPattern}.com`,
    });
    const shortURL4 = await addShortUrl({
      originalUrl: `https://${originalUrlPattern}.com`,
    });
    const shortURL5 = await addShortUrl({
      originalUrl: `https://${originalUrlPattern}.com`,
    });

    const systemUnderTest = await exportShortUrls({
      searchQuery: `https://${originalUrlPattern}.com`,
    });

    const generatedCSVStream =
      uploadToStorageStub.mock.calls[0][0].contentStream;

    const csvAsString = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = [];

      generatedCSVStream.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      generatedCSVStream.on("end", () => {
        resolve(Buffer.concat(chunks).toString("utf-8"));
      });

      generatedCSVStream.on("error", (err) => {
        reject(err);
      });
    });

    const csvAsArray = csvAsString
      .trim()
      .split("\n")
      .map((row) => row.split(","));

    expect(systemUnderTest).toEqual({
      reportUrl: "https://storage.com/report",
    });
    expect(csvAsArray).toEqual([
      ["ID", "URL ORIGINAL", "URL ENCURTADA", "ACESSOS", "CRIADO EM"],
      [shortURL1.id, shortURL1.originalUrl, shortURL1.shortCode, `${shortURL1.accessCount}`, expect.any(String)],
      [shortURL2.id, shortURL2.originalUrl, shortURL2.shortCode, `${shortURL2.accessCount}`, expect.any(String)],
      [shortURL3.id, shortURL3.originalUrl, shortURL3.shortCode, `${shortURL3.accessCount}`, expect.any(String)],
      [shortURL4.id, shortURL4.originalUrl, shortURL4.shortCode, `${shortURL4.accessCount}`, expect.any(String)],
      [shortURL5.id, shortURL5.originalUrl, shortURL5.shortCode, `${shortURL5.accessCount}`, expect.any(String)],
    ]);
  });
});
