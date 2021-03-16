import * as React from 'react';
import { Platform, View } from 'react-native';
import {
    KeyboardRegistry,
    KeyboardUtils,
    KeyboardAccessoryViewProps,
} from 'react-native-ui-lib/keyboard';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UIStyle } from '@tonlabs/uikit.core';
import { ColorVariants, useTheme } from '@tonlabs/uikit.hydrogen';

import { CustomKeyboardWrapper } from './CustomKeyboardWrapper';
import { UIInputAccessoryView } from './UIInputAccessoryView';

const registerCustomKeyboard = (
    kbID: string,
    component: React.ComponentType<any>,
    props?: { [key: string]: any },
) => {
    if (Platform.OS === 'web') {
        // Do nothing
        return;
    }
    if (KeyboardRegistry.registeredKeyboards[kbID] != null) {
        return;
    }

    const params = { ...props, kbComponent: kbID };
    const Component = component;
    const KeyboardComponent = (keyboardProps: any) => (
        <CustomKeyboardWrapper isNativeKeyboard customKeyboardVisible>
            <Component {...keyboardProps} isNativeKeyboard />
        </CustomKeyboardWrapper>
    );
    KeyboardRegistry.registerKeyboard(kbID, () => KeyboardComponent, params);
};

const onItemSelected = (kbID: string, selectedItem: any) => {
    if (Platform.OS === 'web') {
        // Do nothing
        return;
    }
    KeyboardRegistry.onItemSelected(kbID, selectedItem);
};

const dismiss = () => {
    if (Platform.OS === 'web') {
        // Do nothing
        return;
    }
    KeyboardUtils.dismiss();
};

export const UICustomKeyboardUtils = {
    registerCustomKeyboard,
    onItemSelected,
    dismiss,
};

type Props = KeyboardAccessoryViewProps & {
    // onHeightChange?: OnHeightChange;
    customKeyboardComponent?: React.ComponentType<any>;
    customKeyboardVisible: boolean;
    kbID?: string;

    managedScrollViewNativeID?: string;
};

export function UICustomKeyboard(props: Props) {
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    if (Platform.OS === 'web') {
        const CustomKeyboardComponent = props.customKeyboardComponent;
        return (
            <>
                {props.renderContent()}
                <CustomKeyboardWrapper
                    isNativeKeyboard={false}
                    customKeyboardVisible={props.customKeyboardVisible}
                >
                    {CustomKeyboardComponent && (
                        <CustomKeyboardComponent
                            {...props.kbInitialProps}
                            isNativeKeyboard={false}
                            onItemSelected={props.onItemSelected}
                        />
                    )}
                </CustomKeyboardWrapper>
            </>
        );
    }

    return (
        <UIInputAccessoryView
            managedScrollViewNativeID={props.managedScrollViewNativeID}
            // kbComponent={props.customKeyboardVisible ? props.kbID : undefined}
            // onKeyboardResigned={props.onKeyboardResigned}
        >
            {props.renderContent()}
            <View // A dummy view to make SafeArea translates look nicer
                style={[
                    { height: insets?.bottom ?? 0, top: '100%' },
                    UIStyle.container.absoluteFillWidth(),
                    UIStyle.color.getBackgroundColorStyle(
                        theme[ColorVariants.BackgroundPrimary],
                    ),
                ]}
            />
        </UIInputAccessoryView>
    );
}
