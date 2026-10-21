import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { createShortUrl } from "@/app/functions/create-short-urls";
import { addShortUrl } from "@/specs/utils/add-short-urls";

describe("create short URL", () => {
  it("should be able to create a short URL", async () => {
    const shortCode = randomUUID().replaceAll("-", "").slice(0, 12);
    const originalUrl = `https://${randomUUID()}.com`;

    const systemUnderTest = await createShortUrl({ originalUrl, shortCode });

    expect(systemUnderTest).toEqual({
      id: expect.any(String),
      shortCode,
      originalUrl,
      accessCount: 0,
      createdAt: expect.any(Date),
    });
  });

  it("should not create a short URL with an existing short code", async () => {
    const shortUrl = await addShortUrl();

    await expect(
      createShortUrl({
        originalUrl: "https://another-test.com",
        shortCode: shortUrl.shortCode,
      }),
    ).rejects.toThrow("Short code already exists");
  });

  it("should reject an invalid original URL", async () => {
    await expect(
      createShortUrl({ originalUrl: "not-a-url", shortCode: "valid-code" }),
    ).rejects.toThrow();
  });

  it.each(["Uppercase", "two--hyphens", "-leading-hyphen", "trailing-"])(
    "should reject the invalid short code %s",
    async (shortCode) => {
      await expect(
        createShortUrl({ originalUrl: "https://test.com", shortCode }),
      ).rejects.toThrow();
    },
  );

  it("should reject a short code longer than 32 characters", async () => {
    await expect(
      createShortUrl({
        originalUrl: "https://test.com",
        shortCode: "a".repeat(33),
      }),
    ).rejects.toThrow();
  });
});
