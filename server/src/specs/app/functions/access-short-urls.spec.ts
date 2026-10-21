import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { accessShortUrl } from "@/app/functions/access-short-urls";
import { getShortUrlByShortCode } from "@/app/functions/get-short-urls";
import { addShortUrl } from "@/specs/utils/add-short-urls";

describe("access short URL", () => {
  it("should return the original URL and increment its access count", async () => {
    const shortUrl = await addShortUrl({
      originalUrl: `https://${randomUUID()}.com`,
    });

    const originalUrl = await accessShortUrl({ shortCode: shortUrl.shortCode });
    const updatedShortUrl = await getShortUrlByShortCode({
      shortCode: shortUrl.shortCode,
    });

    expect(originalUrl).toBe(shortUrl.originalUrl);
    expect(updatedShortUrl.shortUrl.accessCount).toBe(shortUrl.accessCount + 1);
  });

  it("should throw when the short URL does not exist", async () => {
    const shortCode = randomUUID().replaceAll("-", "").slice(0, 12);

    await expect(accessShortUrl({ shortCode })).rejects.toThrow(
      "Short URL not found",
    );
  });

  it.each(["Uppercase", "two--hyphens", "-leading-hyphen", "trailing-"])(
    "should reject the invalid short code %s",
    async (shortCode) => {
      await expect(accessShortUrl({ shortCode })).rejects.toThrow();
    },
  );

  it("should reject a short code longer than 32 characters", async () => {
    await expect(accessShortUrl({ shortCode: "a".repeat(33) })).rejects.toThrow();
  });
});
