// @flow
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIColor from '../../../helpers/UIColor';
import UIStyle from '../../../helpers/UIStyle';
import UIFunction from '../../../helpers/UIFunction';
import UIComponent from '../../UIComponent';
import UITextButton from '../../buttons/UITextButton';

import type { ReactNavigation } from '../../navigation/UINavigationBar';

export type DetailsRow = {
    caption: ?string,
    value?: ?string | number,
    limit?: number,
    type?: string,
    captionType?: string,
    screen?: string,
    component?: React$Node,
    onPress?: () => void,
    key?: string,
    showAlways?: boolean,
};

export type DetailsList = DetailsRow[];

export type FormatNestedListArgs = {
    list: DetailsList,
    key: string,
    needOffset?: boolean,
}

type Props = {
    narrow?: boolean,
    navigation?: ReactNavigation,
    detailsList: DetailsList,
    style?: ViewStyleProp,
    onPress?: (details: DetailsRow) => void,
    leftCellStyle?: ViewStyleProp,
    rightCellStyle?: ViewStyleProp,
    rowSeparator?: boolean,
}

type State = {};

const styles = StyleSheet.create({
    borderTop: {
        borderTopWidth: 1,
        borderTopColor: UIColor.current.background.whiteLight,
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
        bool: 'bool',
    };

    static captionType = {
        default: 'default',
        header: 'header',
        bold: 'bold',
        topOffset: 'top-offset',
        boldTopOffset: 'bold-top-offset',
    };

    static defaultProps: Props = {
        detailsList: [],
        rowSeparator: true,
    };

    static formatNestedList(args: FormatNestedListArgs | DetailsList, keyParam?: string) {
        let list;
        let key;
        // let needOffset;
        if (args instanceof Array) {
            list = args;
            key = keyParam;
            // needOffset = true;
        } else {
            ({ list, key } = args);
            // needOffset = args.needOffset !== undefined ? args.needOffset : true;
        }

        const generatedKey = key || list[0].caption || '';
        return list.map<DetailsRow>((item, index) => ({
            ...item,
            key: `${item.key ? `${item.key}-` : ''}${generatedKey}`,
            caption: item.caption,
            captionType: item.captionType
                || (!index ? this.captionType.header : this.captionType.default),
        }));
    }

    static testIDs = {
        detailsTextButton: 'detailsTextButton',
    };

    // Events
    onActionPressed(details: DetailsRow) {
        if (details.screen) {
            this.navigateTo(details.screen);
        } else if (this.props.onPress) {
            this.props.onPress(details);
        }
    }

    // Getters
    getTextStyle(type: ?string, value: ?string | number) {
        if (type === UIDetailsTable.cellType.success) {
            return UIStyle.text.successSmallRegular();
        } else if (type === UIDetailsTable.cellType.error) {
            return UIStyle.text.errorSmallRegular();
        } else if (type === UIDetailsTable.cellType.accent) {
            return UIStyle.text.primarySmallMedium();
        } else if (type === UIDetailsTable.cellType.disabled) {
            return UIStyle.text.tertiarySmallRegular();
        } else if (type === UIDetailsTable.cellType.bool && !value) {
            return UIStyle.text.tertiarySmallRegular();
        }
        return UIStyle.text.secondarySmallRegular();
    }

    // Actions
    navigateTo(screen: ?string) {
        const { navigation } = this.props;
        if (navigation && screen) {
            navigation.push(screen);
        }
    }

    // Render
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

    renderCell(details: DetailsRow) {
        const {
            type, value, limit, component, onPress, caption,
        } = details;
        const textStyle = this.getTextStyle(type, value);

        if (type === UIDetailsTable.cellType.numberPercent && limit && limit !== 0 && typeof value === 'number') {
            const primary = UIFunction.getNumberString(value);
            const percent = (value / limit) * 100;
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
                    testID={`table_cell_${caption || 'default'}_value`}
                />
            );
        } else if (component) {
            return component;
        }

        return (
            <Text style={[textStyle, UIStyle.common.flex()]}>
                {type === UIDetailsTable.cellType.bool ? JSON.stringify(value) : value}
            </Text>
        );
    }

    renderCaption(caption: ?string, captionType: ?string) {
        const { leftCellStyle } = this.props;
        const { header, bold, boldTopOffset } = UIDetailsTable.captionType;

        return (
            <View
                style={[
                    leftCellStyle || UIStyle.common.flex(),
                    UIStyle.margin.rightDefault(),
                ]}
            >
                <Text
                    style={[header, bold, boldTopOffset].includes(captionType)
                        ? UIStyle.text.tertiarySmallBold()
                        : UIStyle.text.tertiarySmallRegular()}
                >
                    {caption}
                </Text>
            </View>
        );
    }

    renderRows() {
        const { detailsList, rightCellStyle, rowSeparator } = this.props;
        return detailsList.filter(item => !!item).map<React$Node>((item, index) => {
            const {
                caption, value, captionType, key, showAlways, component,
            } = item;

            const { header, topOffset, boldTopOffset } = UIDetailsTable.captionType;

            if ((value == null || value === '') && !showAlways && !component && captionType !== header) {
                return null;
            }

            const marginTopStyle = [header, topOffset, boldTopOffset].includes(captionType)
                && UIStyle.padding.topHuge();

            return (
                <View
                    style={[
                        UIStyle.padding.vertical(),
                        UIStyle.common.flexRow(),
                        marginTopStyle,
                        index > 0 && rowSeparator && styles.borderTop,
                    ]}
                    key={`details-table-row-${caption || ''}-${value || ''}-${key || ''}-${captionType || ''}`}
                >
                    {this.renderCaption(caption, captionType)}

                    {![header].includes(captionType) && (
                        <View
                            testID={`table_cell_${caption || 'default'}_value`}
                            style={rightCellStyle || UIStyle.common.flex3()}
                        >
                            {this.renderCell(item)}
                        </View>
                    )}
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
