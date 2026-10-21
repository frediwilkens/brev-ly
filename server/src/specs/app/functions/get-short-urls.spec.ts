import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { getShortUrls } from "@/app/functions/get-short-urls";
import { addShortUrl } from "@/specs/utils/add-short-urls";

describe("get short URLs", () => {
  it("should be able to get short URLs", async () => {
    const namePattern = randomUUID();

    const shortUrl1 = await addShortUrl({
      originalUrl: `https://${namePattern}.com`,
    });

    const shortUrl2 = await addShortUrl({
      originalUrl: `https://${namePattern}.com`,
    });
    const shortUrl3 = await addShortUrl({
      originalUrl: `https://${namePattern}.com`,
    });
    const shortUrl4 = await addShortUrl({
      originalUrl: `https://${namePattern}.com`,
    });
    const shortUrl5 = await addShortUrl({
      originalUrl: `https://${namePattern}.com`,
    });

    const systemUnderTest = await getShortUrls({
      searchQuery: `https://${namePattern}.com`,
    });


    expect(systemUnderTest.totalCount).toBe(5);
    expect(systemUnderTest.shortUrls).toEqual([
      expect.objectContaining({ id: shortUrl5.id }),
      expect.objectContaining({ id: shortUrl4.id }),
      expect.objectContaining({ id: shortUrl3.id }),
      expect.objectContaining({ id: shortUrl2.id }),
      expect.objectContaining({ id: shortUrl1.id }),
    ]);
  });

  it("should be able to get paginated short URLs", async () => {
    const namePattern = randomUUID();

    const shortUrl1 = await addShortUrl({
      originalUrl: `https://${namePattern}.com`,
    });

    const shortUrl2 = await addShortUrl({
      originalUrl: `https://${namePattern}.com`,
    });
    const shortUrl3 = await addShortUrl({
      originalUrl: `https://${namePattern}.com`,
    });
    const shortUrl4 = await addShortUrl({
      originalUrl: `https://${namePattern}.com`,
    });
    const shortUrl5 = await addShortUrl({
      originalUrl: `https://${namePattern}.com`,
    });

    let systemUnderTest = await getShortUrls({
      searchQuery: `https://${namePattern}.com`,
      page: 1,
      pageSize: 3
    });


    expect(systemUnderTest.totalCount).toBe(5);
    expect(systemUnderTest.shortUrls).toEqual([
      expect.objectContaining({ id: shortUrl5.id }),
      expect.objectContaining({ id: shortUrl4.id }),
      expect.objectContaining({ id: shortUrl3.id }),
    ]);

    systemUnderTest = await getShortUrls({
      searchQuery: `https://${namePattern}.com`,
      page: 2,
      pageSize: 3
    });


    expect(systemUnderTest.totalCount).toBe(5);
    expect(systemUnderTest.shortUrls).toEqual([
      expect.objectContaining({ id: shortUrl2.id }),
      expect.objectContaining({ id: shortUrl1.id }),
    ]);
  });
});
