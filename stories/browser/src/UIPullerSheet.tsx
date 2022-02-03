import * as React from 'react';
import { useWindowDimensions, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UIConstant } from '@tonlabs/uikit.core';
import { UIBottomSheet, useIntrinsicSizeScrollView } from '@tonlabs/uikit.popups';
import { ScrollView } from '@tonlabs/uikit.scrolls';

const PULLER_HEIGHT = 12;

function SheetContent({ children }: { children: React.ReactNode }) {
    const insets = useSafeAreaInsets();
    const { height } = useWindowDimensions();

    const paddingBottom = Math.max(insets?.bottom || 0, UIConstant.contentOffset());
    const { style: scrollIntrinsicStyle, onContentSizeChange } = useIntrinsicSizeScrollView();
    return (
        <ScrollView
            bounces={false}
            style={{
                height: height - (StatusBar.currentHeight ?? 0) - insets.top - PULLER_HEIGHT,
            }}
            contentContainerStyle={{
                paddingBottom,
            }}
            // @ts-expect-error
            containerStyle={scrollIntrinsicStyle}
            onContentSizeChange={onContentSizeChange}
        >
            {children}
        </ScrollView>
    );
}

export function UIPullerSheet({
    visible,
    onClose,
    children,
}: {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) {
    return (
        <UIBottomSheet visible={visible} onClose={onClose}>
            <SheetContent>{children}</SheetContent>
        </UIBottomSheet>
    );
}
