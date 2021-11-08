import { UIPagerViewContainer } from './UIPagerViewContainer';
import { UIPagerViewPage } from './UIPagerViewPage';

import type { UIPagerViewComponents } from './types';

export * from './types';

export const UIPagerView: UIPagerViewComponents = {
    Container: UIPagerViewContainer,
    Page: UIPagerViewPage,
};
