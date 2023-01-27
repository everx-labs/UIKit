import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIBottomSheet, useIntrinsicSizeScrollView } from '@tonlabs/uikit.popups';
import { ScrollView } from '@tonlabs/uikit.scrolls';

function SheetContent({ children }: { children: React.ReactNode }) {
    const insets = useSafeAreaInsets();

    const paddingBottom = Math.max(insets?.bottom || 0, UILayoutConstant.contentInsetVerticalX4);
    const { style: scrollIntrinsicStyle, onContentSizeChange } = useIntrinsicSizeScrollView();
    return (
        <ScrollView
            bounces={false}
            contentContainerStyle={{
                paddingBottom,
                paddingHorizontal: UILayoutConstant.contentOffset,
            }}
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
