import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { ColorVariants, UILabel, TypographyVariants } from '@tonlabs/uikit.themes';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UILayoutConstant, UISkeleton } from '@tonlabs/uikit.layout';
import type { UILinkProps } from './types';
import { Logo } from './Logo';
import { Icon } from './Icon';

export const UILink: React.FC<UILinkProps> = ({
    title,
    description,
    logoSource,
    iconAfterTitleSource,
    onPress,
    loading,
    testID,
}: UILinkProps) => {
    return (
        <UISkeleton show={!!loading}>
            <TouchableOpacity testID={testID} onPress={onPress} style={styles.container}>
                <Logo logoSource={logoSource} />
                <View style={styles.textContent}>
                    <View style={styles.title}>
                        <UILabel role={TypographyVariants.Action} color={ColorVariants.TextPrimary}>
                            {title}
                        </UILabel>
                        <Icon source={iconAfterTitleSource} />
                    </View>
                    <View>
                        <UILabel
                            role={TypographyVariants.ParagraphFootnote}
                            color={ColorVariants.TextSecondary}
                        >
                            {description}
                        </UILabel>
                    </View>
                </View>
            </TouchableOpacity>
        </UISkeleton>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
    },
    textContent: {
        flex: 1,
    },
    title: {
        flexDirection: 'row',
    },
});
