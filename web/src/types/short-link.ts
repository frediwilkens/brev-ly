export interface ShortLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  accessCount: number;
  createdAt: string;
}

export interface ShortLinksPage {
  shortUrls: ShortLink[];
  totalCount: number;
}
