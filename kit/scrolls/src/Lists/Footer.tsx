import * as React from 'react';
import { LayoutChangeEvent, View } from 'react-native';

export type FooterProps = {
    onLayout: (event: LayoutChangeEvent) => void;
    yCoordinate: number;
    width: number;
    ListFooterComponent?: React.ComponentType | React.ReactElement | null;
};

function FooterImpl({ onLayout, yCoordinate, ListFooterComponent, width }: FooterProps) {
    const footerElement = React.useMemo(() => {
        if (ListFooterComponent) {
            return React.isValidElement(ListFooterComponent) ? (
                ListFooterComponent
            ) : (
                <ListFooterComponent />
            );
        }
        return null;
    }, [ListFooterComponent]);

    return (
        <View
            style={{
                position: 'absolute',
                top: yCoordinate,
                left: 0,
                width,
            }}
            onLayout={onLayout}
        >
            {footerElement}
        </View>
    );
}

export const Footer = React.memo(FooterImpl);
