import * as React from 'react';
import { View, ViewStyle } from 'react-native';
import { UILabel, UILabelRoles, ColorVariants, useTheme, makeStyles } from '@tonlabs/uikit.themes';
import { UICardSheet, UIConstant } from '@tonlabs/uikit.navigation';
import { UIActionSheetAction } from './UIActionSheetAction';
import {
    UIActionSheetActionProps,
    UIActionSheetContainerProps,
    UIActionSheetActionType,
} from './types';

type ActionSheetActions = {
    actionList: React.ReactElement<UIActionSheetActionProps>[];
    cancelAction: React.ReactElement<UIActionSheetActionProps> | undefined;
};
const getActionSheetActions = (children: React.ReactNode): ActionSheetActions => {
    /** cancelAction can be only one or less */
    let cancelAction: React.ReactElement<UIActionSheetActionProps> | undefined;
    const negativeActions: React.ReactElement<UIActionSheetActionProps>[] = [];
    const neutralActions: React.ReactElement<UIActionSheetActionProps>[] = [];
    const sortAction = (action: React.ReactElement<UIActionSheetActionProps>) => {
        if (action.props.type === UIActionSheetActionType.Cancel) {
            cancelAction = action;
        }
        if (action.props.type === UIActionSheetActionType.Negative) {
            negativeActions.push(action);
        }
        if (
            action.props.type === UIActionSheetActionType.Neutral ||
            action.props.type === UIActionSheetActionType.Disabled
        ) {
            neutralActions.push(action);
        }
    };
    React.Children.toArray(children).forEach((child: React.ReactNode): void => {
        if (React.isValidElement(child)) {
            if (child.type === UIActionSheetAction) {
                sortAction(child);
            }
            if (child.type === React.Fragment) {
                const actionSheetActions: ActionSheetActions = getActionSheetActions(
                    child.props.children,
                );
                actionSheetActions.actionList.forEach(sortAction);
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
    const result: React.ReactElement<UIActionSheetActionProps>[] = [
        ...neutralActions,
        ...negativeActions,
    ];
    if (cancelAction) {
        result.push(cancelAction);
    }
    return {
        actionList: result,
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
            <UILabel role={UILabelRoles.ParagraphFootnote} color={ColorVariants.TextSecondary}>
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
        paddingHorizontal: UIConstant.contentOffset,
        paddingVertical: UIConstant.contentInsetVerticalX3,
        backgroundColor: theme[ColorVariants.BackgroundPrimary],
        borderRadius: UIConstant.alertBorderRadius,
    },
    header: {
        paddingVertical: UIConstant.contentInsetVerticalX3,
        paddingHorizontal: UIConstant.contentOffset,
        alignItems: 'center',
    },
    actionsContainer: {
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
}));
