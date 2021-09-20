import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { UILabel, UILabelRoles, makeStyles } from '@tonlabs/uikit.hydrogen';
import { UIConstant } from '@tonlabs/uikit.navigation';
import { useBackHandler } from '@react-native-community/hooks';
import { AlertBox } from './AlertBox';
import { UIAlertViewAction } from './UIAlertViewAction';
import { UIAlertViewActionProps, UIAlertViewContainerProps, UIAlertViewActionType } from './types';

type AlertViewActions = {
    actionList: React.ReactElement<UIAlertViewActionProps>[];
    cancelAction: React.ReactElement<UIAlertViewActionProps> | undefined;
};
const getAlertViewActions = (children: React.ReactNode): AlertViewActions => {
    /** cancelAction can be only one or less */
    let cancelAction: React.ReactElement<UIAlertViewActionProps> | undefined;
    const negativeActions: React.ReactElement<UIAlertViewActionProps>[] = [];
    const neutralActions: React.ReactElement<UIAlertViewActionProps>[] = [];
    const sortAction = (action: React.ReactElement<UIAlertViewActionProps>) => {
        if (action.props.type === UIAlertViewActionType.Cancel) {
            cancelAction = action;
        }
        if (action.props.type === UIAlertViewActionType.Negative) {
            negativeActions.push(action);
        }
        if (action.props.type === UIAlertViewActionType.Neutral) {
            neutralActions.push(action);
        }
    };
    React.Children.toArray(children).forEach((child: React.ReactNode): void => {
        if (React.isValidElement(child)) {
            if (child.type === UIAlertViewAction) {
                sortAction(child);
            }
            if (child.type === React.Fragment) {
                const alertViewActions: AlertViewActions = getAlertViewActions(
                    child.props.children,
                );
                alertViewActions.actionList.forEach(sortAction);
            }
        } else if (__DEV__) {
            throw new Error(
                `UIAlertView can only contain 'UIAlertViewAction' components as its direct children (found ${
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
    const result: React.ReactElement<UIAlertViewActionProps>[] = [
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

const renderTitleLabel = (title?: string): React.ReactElement<typeof UILabel> | null => {
    if (!title) {
        return null;
    }
    return (
        <UILabel role={UILabelRoles.TitleSmall} style={headerStyles.headerTitle}>
            {title}
        </UILabel>
    );
};

const renderNoteLabel = (note?: string): React.ReactElement<typeof UILabel> | null => {
    if (!note) {
        return null;
    }
    return <UILabel role={UILabelRoles.ParagraphFootnote}>{note}</UILabel>;
};
const renderHeader = (
    title: string | undefined,
    note: string | undefined,
): React.ReactElement<View> | null => {
    if (!title && !note) {
        return null;
    }
    return (
        <View style={headerStyles.header}>
            {renderTitleLabel(title)}
            {renderNoteLabel(note)}
        </View>
    );
};

export const UIAlertViewContainer: React.FC<UIAlertViewContainerProps> = (
    props: UIAlertViewContainerProps,
) => {
    const { visible, title, note, testID } = props;

    const alertViewActions: AlertViewActions = React.useMemo(
        () => getAlertViewActions(props.children),
        [props.children],
    );

    useBackHandler(() => {
        if (visible && alertViewActions.cancelAction) {
            alertViewActions.cancelAction.props.onPress();
            return true;
        }
        return false;
    });

    const styles = useStyles(alertViewActions.actionList.length);

    return (
        <AlertBox
            visible={visible}
            onTapUnderlay={alertViewActions.cancelAction?.props.onPress}
            testID={testID}
        >
            <View style={styles.container}>
                {renderHeader(title, note)}
                <View style={styles.actionsContainer}>{alertViewActions.actionList}</View>
            </View>
        </AlertBox>
    );
};

const useStyles = makeStyles((actionCount: number) => ({
    container: {
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    actionsContainer: {
        flexDirection: actionCount === 2 ? 'row-reverse' : 'column',
        flexWrap: actionCount === 2 ? 'wrap' : 'nowrap',
        justifyContent: 'space-around',
    },
}));

const headerStyles = StyleSheet.create({
    header: {
        paddingVertical: UIConstant.contentInsetVerticalX4,
    },
    headerTitle: {
        paddingBottom: 4,
    },
});
