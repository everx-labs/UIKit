// @flow
import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { ViewLayoutEvent } from 'react-native/Libraries/Components/View/ViewPropTypes';

import { UIStyle, UIConstant, UIFunction } from '@tonlabs/uikit.core';
import {
    UIBackgroundView,
    UIBackgroundViewColors,
    UILabel,
    UILabelColors,
    UILabelRoles,
    UILinkButton,
    UILinkButtonSize,
} from '@tonlabs/uikit.hydrogen';

import UIComponent from '../UIComponent';

type Value = ?(string | number | boolean);

export type DetailsRow = {
    caption: ?string,
    value?: Value,
    limit?: number,
    type?: string,
    captionType?: string,
    screen?: string,
    component?: React$Node,
    comment?: string,
    onPress?: () => void,
    key?: string,
    showAlways?: boolean,
};

export type DetailsList = DetailsRow[];

export type FormatNestedListArgs = {
    list: DetailsList,
    key: string,
    needOffset?: boolean,
};

type Props = {
    narrow?: boolean,
    navigation?: any, // TODO use a type from react-navigation
    detailsList: DetailsList,
    style?: ViewStyleProp,
    onPress?: (details: DetailsRow) => void,
    leftCellStyle?: ViewStyleProp,
    rightCellStyle?: ViewStyleProp,
    rowContainerStyle?: ViewStyleProp,
    rowSeparator?: boolean,
};

type State = {
    captionMinWidth: number,
    widthComponent: number,
};

const styles = StyleSheet.create({
    borderTop: {
        height: 1,
        width: '100%',
    },
});

const MAX_PERCENT_CELL_WIDTH = 0.4;

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
        number: 'number',
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
            captionType:
                item.captionType || (!index ? this.captionType.header : this.captionType.default),
        }));
    }

    static testIDs = {
        detailsTextButton: 'detailsTextButton',
    };

    state = {
        captionMinWidth: 0,
        widthComponent: 0,
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
    // eslint-disable-next-line class-methods-use-this
    getTextStyle(type: ?string, value: Value) {
        if (type === UIDetailsTable.cellType.success) {
            return {
                color: UILabelColors.TextPositive,
                role: UILabelRoles.ParagraphText,
            };
        }
        if (type === UIDetailsTable.cellType.error) {
            return {
                color: UILabelColors.TextNegative,
                role: UILabelRoles.ParagraphText,
            };
        }
        if (type === UIDetailsTable.cellType.accent) {
            return {
                color: UILabelColors.TextPrimary,
                role: UILabelRoles.Action,
            };
        }
        if (type === UIDetailsTable.cellType.disabled) {
            return {
                color: UILabelColors.TextTertiary,
                role: UILabelRoles.ParagraphText,
            };
        }
        if (type === UIDetailsTable.cellType.number) {
            return {
                color: UILabelColors.TextPrimary,
                role: UILabelRoles.MonoText,
            };
        }
        if ((type === UIDetailsTable.cellType.bool && !value) || value === false) {
            return {
                color: UILabelColors.TextTertiary,
                role: UILabelRoles.ParagraphText,
            };
        }
        return {
            color: UILabelColors.TextSecondary,
            role: UILabelRoles.ParagraphText,
        };
    }

    // Actions
    navigateTo(screen: ?string) {
        const { navigation } = this.props;
        if (navigation && screen) {
            navigation.push(screen);
        }
    }

    calculateMinWidth = (e: ViewLayoutEvent) => {
        const { layout } = e.nativeEvent;
        const maxWidth = this.state.widthComponent * MAX_PERCENT_CELL_WIDTH;
        if (this.state.captionMinWidth < layout.width) {
            // 10px for correct calculating width
            this.setStateSafely({
                captionMinWidth: Math.min(
                    layout.width + UIConstant.normalContentOffset(),
                    maxWidth,
                ),
            });
        }
    };

    setWidthComponent = (e: ViewLayoutEvent) => {
        const { layout } = e.nativeEvent;
        this.setStateSafely({ widthComponent: layout.width });
    };

    // Render
    // eslint-disable-next-line class-methods-use-this
    renderTextCell(value: number | string, details: string) {
        return (
            <UILabel>
                <UILabel color={UILabelColors.TextPrimary} role={UILabelRoles.ParagraphNote}>
                    {value}
                </UILabel>
                <UILabel color={UILabelColors.TextSecondary} role={UILabelRoles.ParagraphNote}>
                    {details}
                </UILabel>
            </UILabel>
        );
    }

    renderCell(details: DetailsRow) {
        const { type, value, limit, component, onPress, caption } = details;
        const { color, role } = this.getTextStyle(type, value);

        if (
            type === UIDetailsTable.cellType.numberPercent &&
            limit &&
            limit !== 0 &&
            typeof value === 'number'
        ) {
            const primary = UIFunction.getNumberString(value);
            const percent = (value / limit) * 100;
            const formattedPercent = UIFunction.getNumberString(percent);
            const secondary = ` (${formattedPercent} %)`;
            return this.renderTextCell(primary, secondary);
        }
        if (type === UIDetailsTable.cellType.action || onPress) {
            return (
                <View>
                    <UILinkButton
                        testID={`table_cell_clickable_${caption || 'default'}_value`}
                        title={value}
                        size={UILinkButtonSize.Small}
                        onPress={onPress || (() => this.onActionPressed(details))}
                    />
                </View>
            );
        }
        if (component) {
            return component;
        }

        return (
            <UILabel color={color} role={role} style={UIStyle.common.flex()}>
                {type === UIDetailsTable.cellType.bool || value === true || value === false
                    ? JSON.stringify(value)
                    : value}
            </UILabel>
        );
    }

    renderCaption(caption: ?string, captionType: ?string) {
        const { leftCellStyle } = this.props;
        const { header, bold, boldTopOffset } = UIDetailsTable.captionType;

        return (
            <View
                onLayout={this.calculateMinWidth}
                style={[
                    leftCellStyle || UIStyle.common.flex(),
                    this.state.captionMinWidth > 0 && {
                        minWidth: this.state.captionMinWidth,
                        maxWidth: this.state.widthComponent * MAX_PERCENT_CELL_WIDTH,
                    },
                    UIStyle.margin.rightDefault(),
                ]}
            >
                <UILabel
                    color={UILabelColors.TextPrimary}
                    role={
                        [header, bold, boldTopOffset].includes(captionType)
                            ? UILabelRoles.HeadlineHead
                            : UILabelRoles.ParagraphText
                    }
                >
                    {caption}
                </UILabel>
            </View>
        );
    }

    renderRows() {
        const { detailsList, rightCellStyle, rowSeparator, rowContainerStyle } = this.props;
        return detailsList
            .filter(item => !!item)
            .map<React$Node>((item, index) => {
                const { caption, value, captionType, key, showAlways, component, comment } = item;

                const { header, topOffset, boldTopOffset } = UIDetailsTable.captionType;

                if (
                    (value == null || value === '') &&
                    !showAlways &&
                    !component &&
                    captionType !== header
                ) {
                    return null;
                }

                const marginTopStyle =
                    [header, topOffset, boldTopOffset].includes(captionType) &&
                    UIStyle.padding.topHuge();

                return (
                    <View>
                        {index > 0 && rowSeparator && (
                            <UIBackgroundView
                                color={UIBackgroundViewColors.LinePrimary}
                                style={styles.borderTop}
                            />
                        )}
                        <View
                            style={[
                                comment
                                    ? [UIStyle.padding.topDefault(), UIStyle.padding.bottomTiny()]
                                    : UIStyle.padding.vertical(),
                                UIStyle.common.flexRow(),
                                rowContainerStyle,
                                marginTopStyle,
                            ]}
                            key={`details-table-row-${caption || ''}-${
                                JSON.stringify(value) || ''
                            }-${key || ''}-${captionType || ''}`}
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
                        {comment ? (
                            <UILabel
                                color={UILabelColors.TextSecondary}
                                role={UILabelRoles.ParagraphNote}
                                style={UIStyle.padding.bottomDefault()}
                            >
                                {comment}
                            </UILabel>
                        ) : null}
                    </View>
                );
            });
    }

    render() {
        return (
            <View style={this.props.style} onLayout={this.setWidthComponent}>
                {this.renderRows()}
            </View>
        );
    }
}

export default UIDetailsTable;
