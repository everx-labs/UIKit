import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { ColorVariants, UILabel, TypographyVariants } from '@tonlabs/uikit.themes';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UILayoutConstant, UISkeleton } from '@tonlabs/uikit.layout';
import type { UILinkProps } from './types';
import { Logo } from './Logo';
import { Icon } from './Icon';
import { UIConstant } from '../constants';

export const UILink = React.memo(function UILink({
    title,
    description,
    logo,
    onPress,
    loading,
    testID,
}: UILinkProps) {
    return (
        <TouchableOpacity
            testID={testID}
            onPress={onPress}
            style={styles.container}
            disabled={loading}
        >
            <Logo logo={logo} loading={loading} />
            {loading ? (
                <UISkeleton show style={styles.textContentSkeleton} />
            ) : (
                <View style={styles.textContainer}>
                    <View style={styles.title}>
                        <UILabel
                            role={TypographyVariants.Action}
                            color={ColorVariants.TextPrimary}
                            numberOfLines={1}
                            style={styles.titleLabel}
                        >
                            {title}
                        </UILabel>
                        <Icon source={UIAssets.icons.ui.blankUp} />
                    </View>
                    {description == null ? null : (
                        <View>
                            <UILabel
                                role={TypographyVariants.NarrowParagraphFootnote}
                                color={ColorVariants.TextSecondary}
                                numberOfLines={1}
                            >
                                {description}
                            </UILabel>
                        </View>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    textContentSkeleton: {
        flex: 1,
        borderRadius: UIConstant.uiLink.row.borderRadius,
        alignSelf: 'stretch',
    },
    title: {
        flexDirection: 'row',
    },
    titleLabel: {
        flexShrink: 1,
    },
});
