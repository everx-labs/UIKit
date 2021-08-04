// @ts-expect-error do not work with '.web' and '.native' suffixes
// eslint-disable-next-line import/extensions, import/no-unresolved
import { useBase64Image as useBase64ImageImpl } from './useBase64Image';

/**
 * Converts an image to a base64 string
 * @param imageUri the source file received via require (e.g. `require('./some/path/image.png')`)
 * @param name the name of file (in this case `'image.png'`)
 * @returns base64 string or null
 */
export const useBase64Image: (imageUri: any, name: string) => string | null =
    useBase64ImageImpl;
