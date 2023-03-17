import { useInSheetKeyboard } from '../UISheet/useInSheetKeyboard';

export * from './UIModalSheet';
export * from './UIModalPortalManager';
export type { UIModalSheetProps } from './types';

// Better naming just for more convenient use in modals
export const useInModalKeyboard = useInSheetKeyboard;
