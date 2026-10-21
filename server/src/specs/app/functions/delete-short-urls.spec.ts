import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { deleteShortUrl } from "@/app/functions/delete-short-urls";
import { getShortUrlByShortCode } from "@/app/functions/get-short-urls";
import { addShortUrl } from "@/specs/utils/add-short-urls";

describe("delete short URL", () => {
  it("should be able to delete a short URL", async () => {
    const shortUrl = await addShortUrl();

    await expect(
      deleteShortUrl({ shortCode: shortUrl.shortCode }),
    ).resolves.toBeUndefined();
    await expect(
      getShortUrlByShortCode({ shortCode: shortUrl.shortCode }),
    ).rejects.toThrow("ShortUrl not found");
  });

  it("should not fail when the short URL does not exist", async () => {
    const shortCode = randomUUID().replaceAll("-", "").slice(0, 12);

    await expect(deleteShortUrl({ shortCode })).resolves.toBeUndefined();
  });

  it.each(["Uppercase", "two--hyphens", "-leading-hyphen", "trailing-"])(
    "should reject the invalid short code %s",
    async (shortCode) => {
      await expect(deleteShortUrl({ shortCode })).rejects.toThrow();
    },
  );

  it("should reject a short code longer than 32 characters", async () => {
    await expect(deleteShortUrl({ shortCode: "a".repeat(33) })).rejects.toThrow();
  });
});
