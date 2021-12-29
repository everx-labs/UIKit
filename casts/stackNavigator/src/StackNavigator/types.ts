import type { UILargeTitleHeaderProps } from '@tonlabs/uicast.bars';
import type { ColorVariants } from '@tonlabs/uikit.themes';

export type StackNavigationOptions = Omit<UILargeTitleHeaderProps, 'children'> & {
    /**
     * A string or ReactNode to render in large title header
     *
     * `title` property is used as a fallback
     */
    headerLargeTitle?: React.ReactNode | string;
    /**
     * Boolean to prefer large title header (like in iOS setting).
     * For large title to collapse on scroll, the content of the screen
     * should be wrapped in a scrollable view such as `ScrollView` or `FlatList`
     * from our package.
     */
    useHeaderLargeTitle?: boolean;
    /**
     * Whether to show header or not
     *
     * Defaults to true
     *
     * P.S. Basically it's the same options as [`headerShown`](https://github.com/software-mansion/react-native-screens/blob/master/createNativeStackNavigator/README.md#headershown).
     *      Unfortunatelly we can't name it the same,
     *      because we're already using it to prevent drawing of
     *      original header in underlying libraries.
     */
    headerVisible?: boolean;
    /**
     * Background color for the whole screen
     */
    backgroundColor?: ColorVariants;
};
