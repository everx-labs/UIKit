import * as React from 'react';
import { ImageSourcePropType, StyleSheet } from 'react-native';

import { Button } from './Button';
import { UIConstant } from './constants';

export type UIBoxButtonProps = {
    /**
     * Whether the button is disabled or not; if true a button is grayed out and `onPress` does no response
     */
    disabled?: boolean;
    /**
     * Source for the button icon
     */
    icon?: ImageSourcePropType;
    /**
     * Position of icon on the button
     * - `left` - icon to the left near the title
     * - `middle` - icon to the right near the title
     * - `right` - icon at the end of the button
     */
    iconPosition?: 'left' | 'middle' | 'right';
    /**
     * Whether to display a loading indicator instead of button content or not
     */
    loading?: boolean;
    /**
     * Function will be called on button press
     */
    onPress: () => void;
    /**
     * testID for usage in tests
     */
    testID?: string;
    /**
     * Text displayed on the button
     */
    title: string;
    /**
     * Type of the button; specific type allows to set the corresponding accent
     * - `primary` - button with current theme primary background color
     * - `secondary` - button with current theme secondary background color
     * - `tertiary` - button with 1 px border style
     * - `nulled` - button without visible borders and background color
     */
    type?: 'primary' | 'secondary' | 'tertiary' | 'nulled';
};

export const UIBoxButton = ({
    disabled,
    icon,
    iconPosition = 'left',
    loading,
    onPress,
    testID,
    title,
    type= 'primary'
}: UIBoxButtonProps) => {
    return (
        <Button
            containerStyle={[
                styles.container,
                type === 'primary' ? styles.primary : null,
            ]}
            disabled={disabled}
            loading={loading}
            onPress={onPress}
            testID={testID}
        >
            <Button.Content style={styles.centerContent}>
                {iconPosition === 'left' && icon && <Button.Icon source={icon} />}
                <Button.Title>{title}</Button.Title>
                {iconPosition === 'middle' && icon && <Button.Icon source={icon} size="small" />}
            </Button.Content>
            {iconPosition === 'right' && icon && <Button.Icon source={icon} />}
        </Button>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: UIConstant.boxButtonHeight,
        width: 250,
    },
    centerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    primary: {
        backgroundColor: 'blue',
        justifyContent: 'center',
    },
});
