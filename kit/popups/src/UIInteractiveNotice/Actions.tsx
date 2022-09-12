import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIPressableArea } from '@tonlabs/uikit.controls';
import { UILabel, TypographyVariants } from '@tonlabs/uikit.themes';
import type { InteractiveNoticeContentProps, UIInteractiveNoticeAction } from './types';

function Action({ title, onTap }: UIInteractiveNoticeAction) {
    return (
        <UIPressableArea style={styles.action} onPress={onTap} key={title}>
            <UILabel testID="uiNotice_action" role={TypographyVariants.SurfActionSpecial}>
                {title}
            </UILabel>
        </UIPressableArea>
    );
}

export function Actions({
    actions,
}: Pick<InteractiveNoticeContentProps, 'actions'>): React.ReactElement | null {
    const actionList = React.useMemo(() => {
        if (!actions) {
            return [];
        }
        if (Array.isArray(actions)) {
            return actions;
        }
        return [actions];
    }, [actions]);

    if (actionList.length === 0) {
        return null;
    }
    return <View style={styles.container}>{actionList.map(Action)}</View>;
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: UILayoutConstant.contentInsetVerticalX1,
        marginHorizontal: -UILayoutConstant.contentOffset / 2,
        marginBottom: -UILayoutConstant.contentInsetVerticalX2,
    },
    action: {
        paddingHorizontal: UILayoutConstant.contentOffset / 2,
        paddingVertical: UILayoutConstant.contentInsetVerticalX2,
    },
});
