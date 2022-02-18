import { ScrollView as RNScrollViewComponent } from 'react-native';
import { wrapScrollableComponent } from './wrapScrollableComponent';
import type { RNScrollView } from './types';

export const ScrollView: typeof RNScrollView = wrapScrollableComponent(
    RNScrollViewComponent,
    'UIScrollView',
);
