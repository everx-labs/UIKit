import * as React from 'react';
import { ImageStyle, View } from 'react-native';
import { UILabel, UILabelRoles, makeStyles } from '@tonlabs/uikit.themes';
import { UIImage } from '@tonlabs/uikit.media';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { useBackHandler } from '@react-native-community/hooks';
import { AlertBox } from './AlertBox';
import { UIAlertViewAction } from './UIAlertViewAction';
import {
    UIAlertViewActionProps,
    UIAlertViewContainerProps,
    UIAlertViewActionType,
    UIAlertViewIcon,
} from './types';

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
                sortAction(child as React.ReactElement<UIAlertViewActionProps>);
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

type HeaderProps = {
    title: string | undefined;
    note: string | undefined;
    icon: UIAlertViewIcon | undefined;
};

function Header({ title, note, icon }: HeaderProps): React.ReactElement<View> | null {
    const headerStyles = useHeaderStyles(!!note);
    if (!title && !note && !icon) {
        return null;
    }
    return (
        <View style={headerStyles.header}>
            <View style={headerStyles.textContainer}>
                {title ? (
                    <UILabel role={UILabelRoles.TitleSmall} style={headerStyles.headerTitle}>
                        {title}
                    </UILabel>
                ) : null}
                {note ? <UILabel role={UILabelRoles.ParagraphFootnote}>{note}</UILabel> : null}
            </View>
            {icon ? <UIImage {...icon} style={headerStyles.icon as ImageStyle} /> : null}
        </View>
    );
}

export const UIAlertViewContainer: React.FC<UIAlertViewContainerProps> = ({
    visible,
    title,
    note,
    icon,
    testID,
    children,
}: UIAlertViewContainerProps) => {
    const alertViewActions: AlertViewActions = React.useMemo(
        () => getAlertViewActions(children),
        [children],
    );

    useBackHandler(() => {
        if (visible && alertViewActions.cancelAction) {
            alertViewActions.cancelAction.props.onPress();
            return true;
        }
        return false;
    });

    const styles = useStyles();

    return (
        <AlertBox
            visible={visible}
            onTapUnderlay={alertViewActions.cancelAction?.props.onPress}
            testID={testID}
        >
            <View style={styles.container}>
                <Header title={title} note={note} icon={icon} />
                <View style={styles.actionsContainer}>{alertViewActions.actionList}</View>
            </View>
        </AlertBox>
    );
};

const useStyles = makeStyles(() => ({
    container: {
        paddingHorizontal: UILayoutConstant.contentOffset,
    },
    actionsContainer: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'space-around',
    },
}));

const useHeaderStyles = makeStyles((hasNote: boolean) => ({
    header: {
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
        flexDirection: 'row',
    },
    textContainer: {
        flex: 1,
    },
    headerTitle: {
        paddingBottom: hasNote ? UILayoutConstant.contentInsetVerticalX2 : 0,
    },
    icon: {
        width: UILayoutConstant.iconSize,
        aspectRatio: 1,
        marginLeft: UILayoutConstant.contentOffset,
    },
}));
