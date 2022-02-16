import { FlatList as RNFlatListComponent } from 'react-native';
import { wrapScrollableComponent } from './wrapScrollableComponent';
import type { RNFlatList } from './types';

export const FlatList: typeof RNFlatList = wrapScrollableComponent(
    RNFlatListComponent,
    'UIFlatList',
);
