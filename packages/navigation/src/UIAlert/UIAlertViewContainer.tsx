import * as React from 'react';
import { BackHandler, Platform, View } from 'react-native';
import { UILabel, UILabelRoles, makeStyles } from '@tonlabs/uikit.hydrogen';
import { AlertBox } from './AlertBox';
import { UIAlertViewAction } from './UIAlertViewAction';
import {
    UIAlertViewActionProps,
    UIAlertViewContainerProps,
    UIAlertViewActionType,
} from './types';
import { UIConstant } from '../constants';

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
        if (action.props.type === UIAlertViewActionType.Сancel) {
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

export const UIAlertViewContainer: React.FC<UIAlertViewContainerProps> = (
    props: UIAlertViewContainerProps,
) => {
    const { visible, title, note, testID } = props;

    const alertViewActions: AlertViewActions = React.useMemo(
        () => getAlertViewActions(props.children),
        [props.children],
    );

    const onRequestClose: (() => void) | undefined =
        alertViewActions.cancelAction?.props.onPress;

    useBackHandler(onRequestClose);

    const styles = useStyles(alertViewActions.actionList.length);

    return (
        <AlertBox
            visible={visible}
            onTapUnderlay={onRequestClose}
            testID={testID}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <UILabel
                        role={UILabelRoles.TitleSmall}
                        style={styles.headerTitle}
                    >
                        {title}
                    </UILabel>
                    <UILabel role={UILabelRoles.ParagraphFootnote}>
                        {note}
                    </UILabel>
                </View>
                <View style={styles.actionsContainer}>
                    {alertViewActions.actionList}
                </View>
            </View>
        </AlertBox>
    );
};

const useStyles = makeStyles((actionCount: number) => ({
    container: {
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    header: {
        paddingVertical: UIConstant.contentInsetVerticalX4,
    },
    headerTitle: {
        paddingBottom: 4,
    },
    actionsContainer: {
        flexDirection: actionCount === 2 ? 'row-reverse' : 'column',
        flexWrap: actionCount === 2 ? 'wrap' : 'nowrap',
        justifyContent: 'space-around',
    },
}));
