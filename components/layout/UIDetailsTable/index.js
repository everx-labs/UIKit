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

export type Details = {
    caption: ?string,
    value: ?string | number,
    limit?: number,
    type?: string,
    captionType?: string,
    screen?: string,
    tag?: any,
    component?: React$Node,
    onPress?: () => void,
    key?: string,
};

export type DetailsList = Details[];

export type FormatNestedListArgs = {
    list: DetailsList,
    key: string,
    needOffset?: boolean,
    needBullets?: boolean,
}

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
        headerBullet: 'header-bullet',
        bullet: 'bullet',
        bullet2: 'bullet2',
        bullet3: 'bullet2',
    };

    static defaultProps: Props = {
        detailsList: [],
    };

    static formatNestedList(args: FormatNestedListArgs | DetailsList, keyParam?: string) {
        let list;
        let key;
        let needOffset;
        let needBullets;
        if (args instanceof Array) {
            list = args;
            key = keyParam;
            needOffset = true;
            needBullets = true;
        } else {
            list = args.list;
            key = args.key;
            needOffset = args.needOffset !== undefined ? args.needOffset : true;
            needBullets = args.needBullets !== undefined ? args.needBullets : true;
        }
        const result = list.map<Details>((item, index) => {
            let captionType = this.captionType.default;
            const { caption } = item;
            if (index) {
                if (needBullets) {
                    if (item.captionType === this.captionType.bullet) {
                        captionType = this.captionType.bullet2;
                    } else if (item.captionType === this.captionType.header) {
                        captionType = this.captionType.headerBullet;
                    } else {
                        captionType = this.captionType.bullet;
                    }
                }
            } else {
                captionType = this.captionType.header;
            }

            return {
                ...item,
                key,
                caption,
                captionType,
            };
        });

        if (needOffset) {
            result.unshift({ key, value: '', caption: '' });
        }
        return result;
    }

    // Events
    onActionPressed(details: Details) {
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

    getBulletSign(captionType?: string) {
        const { bullet, bullet2, headerBullet } = UIDetailsTable.captionType;
        if (captionType === bullet || captionType === headerBullet) {
            return '•   ';
        }
        if (captionType === bullet2) {
            return '    -   ';
        }
        return '';
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

    renderCell(details: Details) {
        const {
            type, value, limit, component, onPress,
        } = details;
        const textStyle = this.getTextStyle(type, value);
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
                {type === UIDetailsTable.cellType.bool ? JSON.stringify(value) : value}
            </Text>
        );
    }

    renderRows() {
        const { detailsList, leftCellStyle, rightCellStyle } = this.props;
        return detailsList.filter(item => !!item).map<React$Node>((item, index) => {
            const {
                caption, value, captionType, key,
            } = item;
            const { header, headerBullet } = UIDetailsTable.captionType;
            const borderTopStyle = index > 0 &&
                captionType !== header &&
                captionType !== headerBullet &&
                styles.borderTop;
            return (
                <View
                    style={[
                        UIStyle.padding.vertical(),
                        UIStyle.common.flexRow(),
                        borderTopStyle,
                    ]}
                    key={`details-table-row-${caption || ''}-${value || ''}-${key || ''}-${captionType || ''}`}
                >
                    <View
                        style={[
                            leftCellStyle || UIStyle.common.flex(),
                            UIStyle.margin.rightDefault(),
                        ]}
                    >
                        <Text
                            style={captionType === header || captionType === headerBullet
                                ? UIStyle.text.tertiarySmallBold()
                                : UIStyle.text.tertiarySmallRegular()}
                        >
                            {this.getBulletSign(captionType)}{caption}
                        </Text>
                    </View>
                    <View
                        testID={`table_cell_${caption || 'default'}_value`}
                        style={rightCellStyle || UIStyle.common.flex3()}
                    >
                        {this.renderCell(item)}
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
