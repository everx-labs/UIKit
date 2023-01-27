// @ts-expect-error do not work with '.ios' and '.android' suffixes
// eslint-disable-next-line import/no-unresolved, import/extensions
import { useWebFonts as useWebFontsPlatform } from './useWebFonts';

export const useWebFonts: () => void = useWebFontsPlatform;
