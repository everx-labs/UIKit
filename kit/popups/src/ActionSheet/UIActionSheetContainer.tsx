import * as React from 'react';
import { View, ViewStyle } from 'react-native';
import { UILabel, UILabelRoles, ColorVariants, useTheme, makeStyles } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UICardSheet } from '../Sheets';
import {
    UIActionSheetActionProps,
    UIActionSheetContainerProps,
    UIActionSheetActionType,
} from './types';

type ActionSheetActions = {
    actionList: React.ReactNode[];
    cancelAction: React.ReactElement<UIActionSheetActionProps> | undefined;
};
const getActionSheetActions = (children: React.ReactNode): ActionSheetActions => {
    const actions: React.ReactNode[] = [];

    /** cancelAction can be only one or less */
    let cancelAction: React.ReactElement<UIActionSheetActionProps> | undefined;

    React.Children.toArray(children).forEach((child: React.ReactNode): void => {
        if (React.isValidElement(child)) {
            if (child.type === React.Fragment) {
                const actionSheetActions: ActionSheetActions = getActionSheetActions(
                    child.props.children,
                );
                actions.concat(actionSheetActions.actionList);
            } else {
                if (child.props.type === UIActionSheetActionType.Cancel) {
                    cancelAction = child;
                }
                actions.push(child);
            }
        } else if (__DEV__) {
            throw new Error(
                `UIActionSheet can only contain 'UIActionSheetAction' components as its direct children (found ${
                    // eslint-disable-next-line no-nested-ternary
                    React.isValidElement(child)
                        ? `${typeof child.type === 'string' ? child.type : child.type?.name}`
                        : typeof child === 'object'
                        ? JSON.stringify(child)
                        : `'${String(child)}'`
                })`,
            );
        }
    });
    return {
        actionList: actions,
        cancelAction,
    };
};

const renderHeader = (
    note: string | undefined,
    headerStyle: ViewStyle,
): React.ReactElement<View> | null => {
    if (!note) {
        return null;
    }
    return (
        <View style={headerStyle}>
            <UILabel
                role={UILabelRoles.NarrowParagraphFootnote}
                color={ColorVariants.TextSecondary}
            >
                {note}
            </UILabel>
        </View>
    );
};

export const UIActionSheetContainer: React.FC<UIActionSheetContainerProps> = ({
    note,
    visible,
    testID,
    children,
}: UIActionSheetContainerProps) => {
    const actionSheetActions: ActionSheetActions = React.useMemo(
        () => getActionSheetActions(children),
        [children],
    );

    const theme = useTheme();
    const styles = useStyles(theme);

    return (
        <UICardSheet visible={visible} onClose={actionSheetActions.cancelAction?.props.onPress}>
            <View style={styles.container} testID={testID}>
                {renderHeader(note, styles.header as ViewStyle)}
                <View style={styles.actionsContainer}>{actionSheetActions.actionList}</View>
            </View>
        </UICardSheet>
    );
};

const useStyles = makeStyles(theme => ({
    container: {
        paddingHorizontal: UILayoutConstant.contentOffset,
        paddingVertical: UILayoutConstant.contentInsetVerticalX3,
        backgroundColor: theme[ColorVariants.BackgroundPrimary],
        borderRadius: UILayoutConstant.alertBorderRadius,
    },
    header: {
        paddingVertical: UILayoutConstant.contentInsetVerticalX3,
    },
    actionsContainer: {
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
}));
