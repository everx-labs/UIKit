import type React from 'react';
import type { NativeMethods, StyleProp, ViewProps, ViewStyle } from 'react-native';

export type UITooltipProps = {
    /**
     * Content of the tooltip
     */
    message: string;
    /**
     * What should serve as the tooltip trigger, basically any React element (e.g. UIImage, UILabel)
     */
    children: React.ReactElement;
    /**
     * Since the tooltip has a container for it's children, you may want to set styles for it
     */
    style?: StyleProp<ViewStyle>;
    /**
     * UITooltip uses <Portal /> to put itself on top of
     * current components, like a layer.
     * Use the ID if you want to change destination where
     * UITooltip should be put (i.e. you have another <PortalManager />)
     */
    forId?: string;
    /**
     * ID for usage in tests
     */
    testID?: string;
};

export type UITooltipBoxProps = Omit<UITooltipProps, 'children'> & {
    onClose: () => void;
    triggerRef: React.RefObject<NativeMethods>;
};

export type UITooltipContentProps = {
    onLayout: ViewProps['onLayout'];
    children: string;
};

export type UITooltipBackdropProps = {
    onTap: () => void;
    triggerRef: React.RefObject<NativeMethods>;
    contentRef: React.RefObject<NativeMethods>;
};
