import * as React from 'react';
import { BackHandler, Platform, View } from 'react-native';
import { UILabel, UILabelRoles, makeStyles } from '@tonlabs/uikit.hydrogen';
import { AlertBox } from './AlertBox';
import { UIAlertViewAction } from './UIAlertViewAction';
import type {
    UIAlertViewActionProps,
    UIAlertViewContainerProps,
} from '../UIAlertView';
import { UIConstant } from '../constants';

const getAlertViewActions = (
    children: React.ReactNode,
): React.ReactElement<UIAlertViewActionProps>[] => {
    return React.Children.toArray(children).reduce<
        React.ReactElement<UIAlertViewActionProps>[]
    >(
        (
            acc: React.ReactElement<UIAlertViewActionProps>[],
            child: React.ReactNode,
        ): React.ReactElement<UIAlertViewActionProps>[] => {
            if (React.isValidElement(child)) {
                const actions: React.ReactElement<
                    UIAlertViewActionProps
                >[] = acc;
                if (child.type === UIAlertViewAction) {
                    actions.push(child);
                    return actions;
                }

                if (child.type === React.Fragment) {
                    actions.push(...getAlertViewActions(child.props.children));
                    return actions;
                }
            }
            if (__DEV__) {
                throw new Error(
                    `UIAlertView.Container can only contain 'UIAlertView.Action' components as its direct children (found ${
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
            return acc;
        },
        [],
    );
};

const useSortedAlertViewActions = (
    alertViewActions: React.ReactElement<UIAlertViewActionProps>[],
): React.ReactElement<UIAlertViewActionProps>[] => {
    return React.useMemo(() => {
        let cancelAction:
            | React.ReactElement<UIAlertViewActionProps>
            | undefined;
        const negativeActions: React.ReactElement<
            UIAlertViewActionProps
        >[] = [];
        const neutralActions: React.ReactElement<UIAlertViewActionProps>[] = [];
        alertViewActions.forEach(
            (action: React.ReactElement<UIAlertViewActionProps>): void => {
                if (action.props.type === 'Сancel') {
                    cancelAction = action;
                }
                if (action.props.type === 'Negative') {
                    negativeActions.push(action);
                }
                if (action.props.type === 'Neutral') {
                    neutralActions.push(action);
                }
            },
        );
        const result: React.ReactElement<UIAlertViewActionProps>[] = [
            ...neutralActions,
            ...negativeActions,
        ];
        if (cancelAction) {
            result.push(cancelAction);
        }
        return result;
    }, [alertViewActions]);
};

const useOnRequestClose = (
    alertViewActions: React.ReactElement<UIAlertViewActionProps>[],
): (() => void) | undefined => {
    return React.useMemo(() => {
        const cancelAction:
            | React.ReactElement<UIAlertViewActionProps>
            | undefined = alertViewActions.find(
            (action: React.ReactElement<UIAlertViewActionProps>): boolean =>
                action.props.type === 'Сancel',
        );
        return cancelAction?.props.onPress;
    }, [alertViewActions]);
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

    const alertViewActions: React.ReactElement<
        UIAlertViewActionProps
    >[] = React.useMemo(() => getAlertViewActions(props.children), [
        props.children,
    ]);

    const alertViewActionsSorted: React.ReactElement<
        UIAlertViewActionProps
    >[] = useSortedAlertViewActions(alertViewActions);

    const onRequestClose: (() => void) | undefined = useOnRequestClose(
        alertViewActions,
    );

    useBackHandler(onRequestClose);

    const styles = useStyles(alertViewActionsSorted.length);

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
                    {alertViewActionsSorted}
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
