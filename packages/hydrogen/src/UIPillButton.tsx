// import * as React from 'react';
// import {ColorValue, ImageSourcePropType, StyleSheet} from 'react-native';
//
// import {Button, ButtonAnimations, UILayout} from './Button';
// import {UIConstant} from './constants';
// import {ColorVariants, useTheme} from './Colors';
//
// // eslint-disable-next-line no-shadow
// export enum UIPillButtonVariant {
//     Neutral = 'Neutral',
//     Negative = 'Negative',
//     Positive = 'Positive',
// }
//
// // eslint-disable-next-line no-shadow
// export enum UIPillButtonIconPosition {
//     Left = 'Left',
//     Right = 'Right',
// }
//
// export type UIPillButtonProps = {
//     /**
//      * Whether the button is disabled or not; if true a button is grayed out and `onPress` does no response
//      */
//     disabled?: boolean;
//     /**
//      * Source for the button icon
//      */
//     icon?: ImageSourcePropType;
//     /**
//      * Position of icon on the button
//      * - `UIPillButtonIconPosition.Left` - icon to the left near the title
//      * - `UIPillButtonIconPosition.Right` - icon to the right near the title
//      */
//     iconPosition?: UIPillButtonIconPosition;
//     /**
//      * Allows to set top, right, bottom and left margins to the button container
//      */
//     layout?: UILayout;
//     /**
//      * Whether to display a loading indicator instead of button content or not
//      */
//     loading?: boolean;
//     /**
//      * Function will be called on button press
//      */
//     onPress?: () => void | Promise<void>;
//     /**
//      * ID for usage in tests
//      */
//     testID?: string;
//     /**
//      * Text displayed on the button
//      */
//     title?: string;
//     /**
//      * Variant of the button; specific type allows to display the corresponding button action nature
//      * - `UIPillButtonVariant.Neutral` - button with regular action (default)
//      * - `UIPillButtonVariant.Negative` - button associated with some destructive action
//      * - `UIPillButtonVariant.Positive` - button associated with some affirmative action
//      */
//     variant?: UIPillButtonVariant;
// }
//
// const getButtonStates = () => {};
//
// function useButtonAnimations(): ButtonAnimations {}
//
// function useButtonStyles(
//     variant: UIPillButtonVariant,
//     disabled?: boolean,
//     loading?: boolean,
// ) {
//     let backgroundColor: ColorVariants;
//     let contentColor: ColorVariants;
//
//     if (loading) {
//         backgroundColor = ColorVariants.BackgroundNeutral;
//     } else if (disabled) {
//         backgroundColor = ColorVariants.BackgroundAccent;
//         contentColor = ColorVariants.TextOverlayInverted;
//     } else if
//
//     const theme = useTheme();
//
//     const buttonStyle = {
//         backgroundColor: theme[ColorVariants[backgroundColor]] as ColorValue,
//         borderRadius: UIConstant.pillButtonBorderRadius,
//     };
//     return {
//         buttonStyle,
//         contentColor,
//     };
// }
//
// export const UIPillButton = ({
//     disabled,
//     icon,
//     iconPosition = UIPillButtonIconPosition.Left,
//     layout,
//     loading,
//     onPress,
//     testID,
//     title,
//     variant = UIPillButtonVariant.Neutral,
// }: UIPillButtonProps) => {
//     const { buttonStyle, contentColor } = useButtonStyles(variant, disabled, loading);
//     const buttonAnimations = useButtonAnimations();
//
//     return (
//         <Button
//             containerStyle={[
//                 styles.container,
//                 buttonStyle,
//                 layout,
//             ]}
//             contentStyle={styles.content}
//             animations={buttonAnimations}
//             disabled={disabled}
//             loading={loading}
//             onPress={onPress}
//             testID={testID}
//         >
//             <Button.Content>
//                 {
//                     iconPosition === UIPillButtonIconPosition.Left && icon &&
//                         <Button.Icon
//                             source={icon}
//                             iconAnimStyle={buttonAnimations.icon?.style}
//                             initialColor={buttonAnimations.icon?.initialColor}
//                             activeColor={buttonAnimations.icon?.activeColor}
//                         />
//                 }
//                 {
//                     title &&
//                     <Button.Title
//                         titleColor={contentColor}
//                         titleAnimStyle={buttonAnimations.title?.style}
//                     >
//                         {title}
//                     </Button.Title>
//                 }
//                 {
//                     iconPosition === UIPillButtonIconPosition.Right && icon &&
//                         <Button.Icon
//                             source={icon}
//                             iconAnimStyle={buttonAnimations.icon?.style}
//                             initialColor={buttonAnimations.icon?.initialColor}
//                             activeColor={buttonAnimations.icon?.activeColor}
//                         />
//                 }
//             </Button.Content>
//         </Button>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         height: UIConstant.pillButtonHeight,
//     },
//     content: {
//
//     },
// });
