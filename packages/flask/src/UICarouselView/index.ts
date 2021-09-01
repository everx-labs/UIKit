import { UICarouselViewContainer } from './CarouselViewContainer';
import { UICarouselViewPage } from './CarouselViewPage';

import type { UICarouselViewComponents } from './types'

export * from './types';

export const UICarouselView: UICarouselViewComponents = {
    Container: UICarouselViewContainer,
    Page: UICarouselViewPage,
};
