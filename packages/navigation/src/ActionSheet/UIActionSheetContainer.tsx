import * as React from 'react';
import { BackHandler, Platform, View } from 'react-native';
import {
    UILabel,
    UILabelRoles,
    makeStyles,
    ColorVariants,
    useTheme,
} from '@tonlabs/uikit.hydrogen';
import { UICardSheet } from '../Sheets';
import { UIActionSheetAction } from './UIActionSheetAction';
import {
    UIActionSheetActionProps,
    UIActionSheetContainerProps,
    UIActionSheetActionType,
} from './types';
import { UIConstant } from '../constants';

type ActionSheetActions = {
    actionList: React.ReactElement<UIActionSheetActionProps>[];
    cancelAction: React.ReactElement<UIActionSheetActionProps> | undefined;
};
const getActionSheetActions = (
    children: React.ReactNode,
): ActionSheetActions => {
    /** cancelAction can be only one or less */
    let cancelAction: React.ReactElement<UIActionSheetActionProps> | undefined;
    const negativeActions: React.ReactElement<UIActionSheetActionProps>[] = [];
    const neutralActions: React.ReactElement<UIActionSheetActionProps>[] = [];
    const sortAction = (
        action: React.ReactElement<UIActionSheetActionProps>,
    ) => {
        if (action.props.type === UIActionSheetActionType.Сancel) {
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
                        ? `${
                              typeof child.type === 'string'
                                  ? child.type
                                  : child.type?.name
                          }`
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

const useBackHandler = (onRequestClose?: () => void): void => {
    React.useEffect(() => {
        if (Platform.OS !== 'android') {
            return undefined;
        }
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                if (onRequestClose) {
                    onRequestClose();
                }
                return true;
            },
        );
        return () => {
            if (backHandler) {
                backHandler.remove();
            }
        };
    }, [onRequestClose]);
};

export const UIActionSheetContainer: React.FC<UIActionSheetContainerProps> = (
    props: UIActionSheetContainerProps,
) => {
    const { note, visible, testID } = props;
    visible;

    const actionSheetActions: ActionSheetActions = React.useMemo(
        () => getActionSheetActions(props.children),
        [props.children],
    );

    const onRequestClose: (() => void) | undefined =
        actionSheetActions.cancelAction?.props.onPress;

    useBackHandler(onRequestClose);

    const theme = useTheme();
    const styles = useStyles(theme);

    return (
        <UICardSheet visible={visible} onClose={onRequestClose}>
            <View style={styles.container} testID={testID}>
                <View style={styles.header}>
                    <UILabel
                        role={UILabelRoles.ParagraphFootnote}
                        color={ColorVariants.TextSecondary}
                    >
                        {note}
                    </UILabel>
                </View>
                <View style={styles.actionsContainer}>
                    {actionSheetActions.actionList}
                </View>
            </View>
        </UICardSheet>
    );
};

const useStyles = makeStyles((theme) => ({
    container: {
        paddingHorizontal: UIConstant.contentOffset,
        paddingVertical: UIConstant.contentInsetVerticalX3,
        backgroundColor: theme[ColorVariants.BackgroundPrimary],
        borderRadius: UIConstant.alertBorderRadius,
    },
    header: {
        paddingVertical: UIConstant.contentInsetVerticalX3,
        paddingHorizontal: UIConstant.contentOffset,
    },
    headerTitle: {
        paddingBottom: 4,
    },
    actionsContainer: {
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
}));
