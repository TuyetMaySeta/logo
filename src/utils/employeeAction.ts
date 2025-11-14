/**
 * Utility functions for employee actions
 * These are standalone helper functions that don't involve API calls
 */

/**
 * Download blob as file
 */
export const downloadBlob = (
  blob: Blob,
  filename: string,
  mimeType?: string
): void => {
  const blobWithType = mimeType ? new Blob([blob], { type: mimeType }) : blob;
  const url = window.URL.createObjectURL(blobWithType);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Extract filename from Content-Disposition header
 */
export const extractFilenameFromHeader = (
  contentDisposition: string | undefined,
  fallback: string
): string => {
  if (!contentDisposition) return fallback;

  const filenameMatch = contentDisposition.match(
    /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
  );

  if (filenameMatch?.[1]) {
    return filenameMatch[1].replace(/['"]/g, "").trim();
  }

  return fallback;
};