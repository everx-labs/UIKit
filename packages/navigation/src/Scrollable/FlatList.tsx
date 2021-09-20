import { FlatList as RNFlatList } from 'react-native';
import { wrapScrollableComponent } from './wrapScrollableComponent';

export const FlatList: typeof RNFlatList = wrapScrollableComponent(RNFlatList, 'UIFlatList');
