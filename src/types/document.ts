export interface DownloadCVResponse {
  data: Blob;
  headers: Record<string, string>;
}

export interface ShareLinkResponse {
  share_url?: string;
  url?: string;
  link?: string;
}