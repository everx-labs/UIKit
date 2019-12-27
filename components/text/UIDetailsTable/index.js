// @flow
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIColor from '../../../helpers/UIColor';
import UIStyle from '../../../helpers/UIStyle';
import UIFunction from '../../../helpers/UIFunction';
import UIComponent from '../../UIComponent';
import UITextButton from '../../buttons/UITextButton'

import type { ReactNavigation } from '../../navigation/UINavigationBar';

export type Details = {
    caption: ?string,
    value: ?string | number,
    limit?: number,
    type?: string,
    screen?: string,
    tag?: any,
    component?: React$Node,
    onPress?: () => void,
};

export type DetailsList = Details[];

type Props = {
    navigation?: ReactNavigation,
    detailsList: DetailsList,
    style?: ViewStyleProp,
    onPress?: (details: Details) => void,
    leftCellStyle?: ViewStyleProp,
    rightCellStyle?: ViewStyleProp,
}

type State = {};

const styles = StyleSheet.create({
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: UIColor.current.background.whiteLight,
    },
});

class UIDetailsTable extends UIComponent<Props, State> {
    // deprecated
    static CellType = {
        Default: 'default',
        Success: 'success',
        Action: 'action',
        Accent: 'accent',
        Error: 'error',
        NumberPercent: 'numberPercent',
        Disabled: 'disabled',
    };

    static cellType = {
        default: 'default',
        success: 'success',
        action: 'action',
        accent: 'accent',
        error: 'error',
        numberPercent: 'numberPercent',
        disabled: 'disabled',
    };

    static defaultProps: Props = {
        detailsList: [],
    };

    // Events
    onActionPressed(details: Details) {
        if (details.screen) {
            this.navigateTo(details.screen);
        } else if (this.props.onPress) {
            this.props.onPress(details);
        }
    }

    // Actions
    navigateTo(screen: ?string) {
        const { navigation } = this.props;
        if (navigation && screen) {
            navigation.push(screen);
        }
    }

    // Getters
    getTextStyle(type: ?string) {
        if (type === UIDetailsTable.cellType.success) {
            return UIStyle.text.successSmallRegular();
        } else if (type === UIDetailsTable.cellType.error) {
            return UIStyle.text.errorSmallRegular();
        } else if (type === UIDetailsTable.cellType.accent) {
            return UIStyle.text.primarySmallMedium();
        } else if (type === UIDetailsTable.cellType.disabled) {
            return UIStyle.text.tertiarySmallRegular();
        } else if (type === UIDetailsTable.cellType.default || !type) {
            return UIStyle.text.secondarySmallRegular();
        }
        return null;
    }

    renderTextCell(value: number | string, details: string) {
        return (
            <Text>
                <Text style={UIStyle.text.primarySmallRegular()}>
                    {value}
                </Text>
                <Text style={UIStyle.text.secondarySmallRegular()}>
                    {details}
                </Text>
            </Text>
        );
    }

    renderCell(details: Details) {
        const {
            type, value, limit, component, onPress,
        } = details;
        const textStyle = this.getTextStyle(type);
        if ((!value && value !== 0) && !component) {
            return null;
        }
        if (type === UIDetailsTable.cellType.numberPercent && limit && limit !== 0 && typeof value === 'number') {
            const primary = UIFunction.getNumberString(value);
            const percent = (primary / limit) * 100;
            const formattedPercent = UIFunction.getNumberString(percent);
            const secondary = ` (${formattedPercent} %)`;
            return this.renderTextCell(primary, secondary);
        } else if (type === UIDetailsTable.cellType.action || onPress) {
            return (
                <UITextButton
                    multiLine
                    textStyle={UIStyle.text.actionSmallMedium()}
                    title={value}
                    onPress={onPress || (() => this.onActionPressed(details))}
                />
            );
        } else if (component) {
            return component;
        }
        return (
            <Text style={[textStyle, UIStyle.common.flex()]}>
                {value}
            </Text>
        );
    }

    renderRows() {
        const { detailsList } = this.props;
        return detailsList.map<React$Node>((item, index) => {
            const cell = this.renderCell(item);
            const { caption, value } = item;
            const testIDCaption = caption || 'default';
            const borderBottomStyle = index < detailsList.length - 1 ? styles.borderBottom : null;
            return (
                <View
                    style={[
                        UIStyle.padding.vertical(),
                        UIStyle.common.flexRow(),
                        borderBottomStyle,
                    ]}
                    key={`details-table-row-${caption || ''}-${value || ''}`}
                >
                    <View
                        style={[
                            this.props.leftCellStyle || UIStyle.common.flex(),
                            UIStyle.margin.rightDefault(),
                        ]}
                    >
                        <Text
                            numberOfLines={1}
                            style={UIStyle.text.tertiarySmallRegular()}
                        >
                            {caption}
                        </Text>
                    </View>
                    <View
                        testID={`table_cell_${testIDCaption}_value`}
                        style={this.props.rightCellStyle || UIStyle.common.flex3()}
                    >
                        {cell}
                    </View>
                </View>
            );
        });
    }

    render() {
        return (
            <View style={this.props.style}>
                {this.renderRows()}
            </View>
        );
    }
}

export default UIDetailsTable;
