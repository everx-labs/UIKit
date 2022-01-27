import { UIMenuContainer } from './Menu';

export * from './Menu/types';

// ts doesn't understand that we assign [Action] later, and want to see it right away
export const UIMenu: typeof UIMenuContainer = UIMenuContainer;
