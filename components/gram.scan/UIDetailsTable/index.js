// @flow
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import StylePropType from 'react-style-proptype';

import UILocalized from '../../../helpers/UILocalized';
import UIStyle from '../../../helpers/UIStyle';
import UITextStyle from '../../../helpers/UITextStyle';
import UIComponent from '../../UIComponent';

import type { ReactNavigation } from '../../navigation/UINavigationBar';

export type Details = {
    caption: ?string,
    value: ?string,
    type?: string,
    screen?: string,
};

export type DetailsList = { [string]: Details };

type Props = {
    navigation?: ReactNavigation,
    detailsList: ?DetailsList;
}

type State = {};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        paddingVertical: 16,
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
        Gram: 'Gram',
    };

    navigateTo(screen: ?string) {
        const { navigation } = this.props;
        if (navigation && screen) {
            navigation.push(screen);
        }
    }

    getTextStyle(type: ?string) {
        const {
            primarySmallRegular,
            successSmallRegular,
            primarySmallMedium,
        } = UITextStyle;
        if (type === UIDetailsTable.CellType.Success) {
            return successSmallRegular;
        } else if (type === UIDetailsTable.CellType.Accent) {
            return primarySmallMedium;
        } else if (type === UIDetailsTable.CellType.Default || !type) {
            return primarySmallRegular;
        }
        return null;
    }

    renderTextCell(value: string, details: string) {
        const { secondarySmallRegular, primarySmallRegular } = UITextStyle;
        return (
            <Text>
                <Text style={primarySmallRegular}>
                    {value}
                </Text>
                <Text style={secondarySmallRegular}>
                    {details}
                </Text>
            </Text>
        );
    }

    renderCell(type: ?string, textStyle: StylePropType, value: ?string, screen: ?string) {
        const { actionSmallMedium } = UITextStyle;
        if (!value) {
            return null;
        }
        if (type === UIDetailsTable.CellType.NumberPercent) {
            const [number, percent] = value.split('(');
            return this.renderTextCell(
                number,
                `(${percent}`,
            );
        } else if (type === UIDetailsTable.CellType.Gram) {
            const [integer, fractional] = value.split('.');
            return this.renderTextCell(
                integer,
                `.${fractional} ${UILocalized.gram}`,
            );
        } else if (type === UIDetailsTable.CellType.Action) {
            // actionSmallMedium;
            return (
                <TouchableOpacity onPress={() => this.navigateTo(screen)}>
                    <Text style={actionSmallMedium}>
                        {value}
                    </Text>
                </TouchableOpacity>
            );
        }
        return (
            <Text style={[textStyle, UIStyle.flex]}>
                {value}
            </Text>
        );
    }

    render() {
        const { detailsList } = this.props;
        if (!detailsList) {
            return null;
        }
        const cells = Object.keys(detailsList)
            .map<React$Node>((name: string) => {
                const {
                    caption, value, type, screen,
                } = detailsList[name];
                const { secondarySmallRegular } = UITextStyle;
                const textStyle = this.getTextStyle(type);

                const cell = this.renderCell(type, textStyle, value, screen);
                return (
                    <View style={styles.row} key={`details-table-row-${name}-${value || ''}`}>
                        <View style={[styles.leftCell, UIStyle.marginRightDefault]}>
                            <Text
                                numberOfLines={1}
                                style={secondarySmallRegular}
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
        return cells;
    }

    static defaultProps: Props;
}

export default UIDetailsTable;

UIDetailsTable.defaultProps = {
    detailsList: null,
};
