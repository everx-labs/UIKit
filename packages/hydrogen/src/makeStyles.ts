import * as React from 'react';
import type { ViewStyle, TextStyle, ImageStyle } from 'react-native';

export type NamedStyles<T> = {
    [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};
export type FunctionStyles<T> = (...args: any[]) => NamedStyles<T>;

type MakeStyles = <T extends Record<string, unknown>>(
    styles: NamedStyles<T> | FunctionStyles<T>,
) => (...args: unknown[]) => NamedStyles<T>;

/**
 * This function is used to dynamically style the React component.
 *
 * Usecase: {
 *      // Make a hook:
 *      const useStyles = makeStyles((theme, dynamicWidth) => ({
 *          container: {
 *              width: dynamicWidth,
 *              backgroundColor: theme[ColorVariants.BackgroundPrimary],
 *          },
 *      }));
 *
 *      // Use it in React component:
 *      const component: React.FC = (props) => {
 *          const theme = useTheme();
 *          const dynamicWidth = /Some calculation e.g. from props.width/;
 *          const styles = useStyles(theme, dynamicWidth);
 *
 *          return <View style={styles.container}>;
 *      };
 * }
 *
 * @param styles Can be a style `object` or a `function` that returns a style object
 * @returns A hook that accepts arguments that it passes as parameters to the `styles` function
 */
export const makeStyles: MakeStyles =
    styles =>
    (...args) => {
        return React.useMemo(() => {
            if (typeof styles === 'function') {
                return styles(...args);
            }
            return styles;
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [...args]);
    };
