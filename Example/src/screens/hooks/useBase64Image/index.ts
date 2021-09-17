// @ts-expect-error do not work with '.web' and '.native' suffixes
// eslint-disable-next-line import/extensions, import/no-unresolved
import { useBase64Image as useBase64ImageImpl } from './useBase64Image';

/**
 * Converts an image to a base64 string
 * @param imageUrl the source of file
 * @returns base64 string or null
 */
export const useBase64Image: (imageUrl: string) => string | null = useBase64ImageImpl;
