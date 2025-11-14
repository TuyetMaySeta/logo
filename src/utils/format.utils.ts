/**
 * File: /home/truonghoang/document/SETA/EMS-fe/src/utils/format.utils.ts
 *
 * Utility to convert dates from "yyyy-mm-dd" (or Date) to "dd/mm/yyyy".
 */

/**
 * Convert a date in "yyyy-mm-dd" format (or a Date object) to "dd/mm/yyyy".
 * Returns empty string for invalid/empty input.
 *
 * Examples:
 *   yyyymmddToDdMmYyyy('2025-01-05') // "05/01/2025"
 *   yyyymmddToDdMmYyyy(new Date(2025, 0, 5)) // "05/01/2025"
 */
export function yyyymmddToDdMmYyyy(input: string | Date | null | undefined): string {
    if (input == null || input === '') return '';

    if (input instanceof Date) {
        if (isNaN(input.getTime())) return '';
        const dd = String(input.getDate()).padStart(2, '0');
        const mm = String(input.getMonth() + 1).padStart(2, '0');
        const yyyy = input.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    }

    const s = String(input).trim();

    // Match "yyyy-mm-dd" optionally followed by time (T...)
    const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|T)/);
    if (isoMatch) {
        const [, yyyy, mm, dd] = isoMatch;
        return `${dd}/${mm}/${yyyy}`;
    }

    // Fallback: try Date parsing
    const parsed = new Date(s);
    if (!isNaN(parsed.getTime())) {
        const dd = String(parsed.getDate()).padStart(2, '0');
        const mm = String(parsed.getMonth() + 1).padStart(2, '0');
        const yyyy = parsed.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    }

    return '';
}

export default yyyymmddToDdMmYyyy;