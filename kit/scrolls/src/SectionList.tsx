import { SectionList as RNSectionList } from 'react-native';
import { wrapScrollableComponent } from './wrapScrollableComponent';

export const SectionList: typeof RNSectionList = wrapScrollableComponent(
    RNSectionList,
    'UISectionList',
);
