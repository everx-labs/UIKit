// @flow
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import UIColor from '../../../helpers/UIColor';

import UIStyle from '../../../helpers/UIStyle';
import UIComponent from '../../UIComponent';

import type { ReactNavigation } from '../../navigation/UINavigationBar';
import { UIFunction } from '../../../UIKit';

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
    onPress?: (details: Details) => void,
}

type State = {};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: UIColor.current.background.whiteLight,
    },
    leftCell: {
        flex: 1,
    },
    rightCell: {
        flex: 3,
    },
});

class UIDetailsTable extends UIComponent<Props, State> {
    static CellType = {
        Default: 'Default',
        Success: 'Success',
        Action: 'Action',
        Accent: 'Accent',
        NumberPercent: 'NumberPercent',
        Disabled: 'Disabled',
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
        if (type === UIDetailsTable.CellType.Success) {
            return UIStyle.Text.successSmallRegular();
        } else if (type === UIDetailsTable.CellType.Accent) {
            return UIStyle.Text.primarySmallMedium();
        } else if (type === UIDetailsTable.CellType.Disabled) {
            return UIStyle.Text.tertiarySmallRegular();
        } else if (type === UIDetailsTable.CellType.Default || !type) {
            return UIStyle.Text.secondarySmallRegular();
        }
        return null;
    }

    renderTextCell(value: number | string, details: string) {
        return (
            <Text>
                <Text style={UIStyle.Text.primarySmallRegular()}>
                    {value}
                </Text>
                <Text style={UIStyle.Text.secondarySmallRegular()}>
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
        if (type === UIDetailsTable.CellType.NumberPercent && limit && limit !== 0 && typeof value === 'number') {
            const primary = UIFunction.getNumberString(value);
            const percent = (primary / limit) * 100;
            const formattedPercent = UIFunction.getNumberString(percent);
            const secondary = ` (${formattedPercent} %)`;
            return this.renderTextCell(primary, secondary);
        } else if (type === UIDetailsTable.CellType.Action) {
            return (
                <TouchableOpacity onPress={() => this.onActionPressed(details)}>
                    <Text style={UIStyle.Text.actionSmallMedium()}>
                        {value}
                    </Text>
                </TouchableOpacity>
            );
        } else if (onPress) {
            return (
                <TouchableOpacity onPress={onPress}>
                    <Text style={UIStyle.Text.actionSmallMedium()}>
                        {value}
                    </Text>
                </TouchableOpacity>
            );
        } else if (component) {
            return component;
        }
        return (
            <Text style={[textStyle, UIStyle.Common.flex()]}>
                {value}
            </Text>
        );
    }

    render() {
        const { detailsList } = this.props;
        return detailsList.map<React$Node>((item) => {
            const cell = this.renderCell(item);
            const { caption, value } = item;
            return (
                <View style={styles.row} key={`details-table-row-${caption || ''}-${value || ''}`}>
                    <View style={[styles.leftCell, UIStyle.Margin.rightDefault()]}>
                        <Text
                            numberOfLines={1}
                            style={UIStyle.Text.tertiarySmallRegular()}
                        >
                            {caption}
                        </Text>
                    </View>
                    <View style={styles.rightCell}>
                        {cell}
                    </View>
                </View>
            );
        });
    }

}

export default UIDetailsTable;
