import * as React from 'react';
import { View } from 'react-native';
import { makeStyles, useTheme, UILabel, ColorVariants } from '@tonlabs/uikit.themes';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { uiLocalized } from '@tonlabs/localization';
import type { UIExpandableTextProps } from './types';
import { UILayout } from '../constants';
import { MeasureLabel } from './MeasureLabel';

function UIExpandableTextImpl(props: UIExpandableTextProps) {
    const { numberOfLines, testID, ...rest } = props;
    const theme = useTheme();
    const styles = useStyles(theme);

    const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
    const [isFit, setIsFit] = React.useState<boolean>(false);

    const onExpand = React.useCallback(() => {
        setIsExpanded(true);
    }, []);

    return (
        <View style={styles.container} testID={testID}>
            <MeasureLabel {...props} setIsFit={setIsFit} />
            <UILabel
                {...props}
                numberOfLines={isExpanded ? undefined : numberOfLines}
                testID={`UIExpandableText.Text:${testID}`}
            />
            {isExpanded || isFit ? null : (
                <TouchableOpacity
                    onPress={onExpand}
                    style={styles.moreButton}
                    testID={`UIExpandableText.MoreButton:${testID}`}
                >
                    <UILabel {...rest} color={ColorVariants.TextAccent}>
                        {uiLocalized.ExpandableText.more}
                    </UILabel>
                </TouchableOpacity>
            )}
        </View>
    );
}

const useStyles = makeStyles(() => ({
    container: {
        alignItems: 'flex-start',
    },
    moreButton: {
        paddingRight: UILayout.expandableText.moreButtonRightHitSlop,
    },
}));

export const UIExpandableText = React.memo(UIExpandableTextImpl);
