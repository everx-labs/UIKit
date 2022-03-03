import { SectionList as RNSectionListComponent } from 'react-native';
import { wrapScrollableComponent } from './wrapScrollableComponent';
import type { RNSectionList } from './types';

export const SectionList: typeof RNSectionList = wrapScrollableComponent(
    RNSectionListComponent,
    'UISectionList',
);
