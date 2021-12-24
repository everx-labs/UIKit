import * as React from 'react';
import { View } from 'react-native';
import { makeStyles, useTheme, UILabel, ColorVariants } from '@tonlabs/uikit.themes';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import type { UIExpandableTextProps } from './types';

export function UIExpandableText(props: UIExpandableTextProps) {
    const { numberOfLines } = props;
    const theme = useTheme();
    const styles = useStyles(theme);
    const [isExpandable, setIsExpandable] = React.useState<boolean>(false);
    const onExpand = React.useCallback(() => {
        setIsExpandable(true);
    }, []);
    return (
        <View style={styles.container}>
            <UILabel {...props} numberOfLines={isExpandable ? undefined : numberOfLines} />
            {isExpandable || (
                <TouchableOpacity onPress={onExpand}>
                    <UILabel {...props} color={ColorVariants.TextAccent}>
                        more
                    </UILabel>
                </TouchableOpacity>
            )}
        </View>
    );
}

const useStyles = makeStyles(() => ({
    container: {},
}));
