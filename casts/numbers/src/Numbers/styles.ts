import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    integer: {
        fontVariant: ['tabular-nums'],
        // Crazy thing, but on Android to align it with a baseline
        // we need to adjust position a bit
        // ...Platform.select({
        //     android: {
        //         transform: [
        //             {
        //                 translateY: getFontMesurements(integerVariant)?.descentBottom ?? 0,
        //             },
        //         ],
        //     },
        //     default: {},
        // }),
    },
    decimal: {
        fontVariant: ['tabular-nums'],
        // Crazy thing, but on Android to align it with a baseline
        // we need to adjust position a bit
        // ...Platform.select({
        //     android: {
        //         transform: [
        //             {
        //                 translateY: getFontMesurements(decimalVariant)?.descentBottom ?? 0,
        //             },
        //         ],
        //     },
        //     default: {},
        // }),
    },
});
