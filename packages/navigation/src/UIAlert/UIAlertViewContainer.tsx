import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { UILabel, UILabelRoles } from '@tonlabs/uikit.hydrogen';
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
                const pages: React.ReactElement<UIAlertViewActionProps>[] = acc;
                if (child.type === UIAlertViewAction) {
                    pages.push(child);
                    return pages;
                }

                if (child.type === React.Fragment) {
                    pages.push(...getAlertViewActions(child.props.children));
                    return pages;
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

export const UIAlertViewContainer: React.FC<UIAlertViewContainerProps> = (
    props: UIAlertViewContainerProps,
) => {
    const { visible, title, note, onTapUnderlay, testID } = props;
    const alertViewActions: React.ReactElement<
        UIAlertViewActionProps
    >[] = React.useMemo(() => getAlertViewActions(props.children), [
        props.children,
    ]);
    return (
        <AlertBox
            visible={visible}
            onTapUnderlay={onTapUnderlay}
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
                <View style={styles.actionsContainer}>{alertViewActions}</View>
            </View>
        </AlertBox>
    );
};

const styles = StyleSheet.create({
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
});
