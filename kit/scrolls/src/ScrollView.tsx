import { ScrollView as RNScrollView } from 'react-native';
import { wrapScrollableComponent } from './wrapScrollableComponent';

export const ScrollView: typeof RNScrollView = wrapScrollableComponent(
    RNScrollView,
    'UIScrollView',
);
