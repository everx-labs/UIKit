import { Platform, TouchableOpacity as RNTouchableOpacity } from 'react-native';
import { TouchableOpacity as RNGHTouchableOpacity } from 'react-native-gesture-handler';

export const TouchableOpacity: typeof RNTouchableOpacity =
    Platform.OS === 'web'
        ? (RNTouchableOpacity as any)
        : (RNGHTouchableOpacity as any);
