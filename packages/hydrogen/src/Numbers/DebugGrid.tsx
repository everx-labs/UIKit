import * as React from 'react';
import { View } from 'react-native';
import { getFontMesurements, TypographyVariants } from '../Typography';

export function DebugGrid({ variant }: { variant: TypographyVariants }) {
    return (
        <>
            <View
                style={[
                    { position: 'absolute', left: 0, right: 0, bottom: 0 },
                    { height: getFontMesurements(variant)?.baseline },
                    { backgroundColor: 'rgba(0,255,0,0.8)' },
                ]}
            />
            <View
                style={[
                    { position: 'absolute', left: 0, right: 0, bottom: 0 },
                    { height: getFontMesurements(variant)?.middleline },
                    { backgroundColor: 'rgba(255,0,0,0.6)' },
                ]}
            />
            <View
                style={[
                    { position: 'absolute', left: 0, right: 0, bottom: 0 },
                    { height: getFontMesurements(variant)?.lowerline },
                    { backgroundColor: 'rgba(200,0,200,0.4)' },
                ]}
            />
            <View
                style={[
                    { position: 'absolute', left: 0, right: 0, bottom: 0 },
                    { height: getFontMesurements(variant)?.upperline },
                    { backgroundColor: 'rgba(0,100,200,0.2)' },
                ]}
            />
        </>
    );
}
