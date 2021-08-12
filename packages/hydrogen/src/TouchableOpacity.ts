import { Platform, TouchableOpacity as RNTouchableOpacity } from 'react-native';
import { TouchableOpacity as RNGHTouchableOpacity } from 'react-native-gesture-handler';

export const TouchableOpacity = Platform.OS === 'web' ? RNTouchableOpacity : RNGHTouchableOpacity;
