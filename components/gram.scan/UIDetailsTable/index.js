import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import UILocalized from '../../../helpers/UILocalized';
import UIStyle from '../../../helpers/UIStyle';
import UITextStyle from '../../../helpers/UITextStyle';
import UIComponent from '../../UIComponent';

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

class UIDetailsTable extends UIComponent {
    static CellType = {
        Default: 'Default',
        Success: 'Success',
        Action: 'Action',
        Accent: 'Accent',
        NumberPercent: 'NumberPercent',
        Gram: 'Gram',
    };

    navigateTo(screen) {
        const { navigation } = this.props;
        if (navigation && screen) {
            navigation.navigate(screen);
        }
    }

    render() {
        const { detailsList } = this.props;
        const cells = Object.keys(detailsList)
            .map((name) => {
                const {
                    caption, value, type, screen,
                } = detailsList[name];
                const {
                    secondarySmallRegular,
                    primarySmallRegular,
                    successSmallRegular,
                    actionSmallMedium,
                    primarySmallMedium,
                } = UITextStyle;
                let textStyle;
                if (type === UIDetailsTable.CellType.Success) {
                    textStyle = successSmallRegular;
                } else if (type === UIDetailsTable.CellType.Accent) {
                    textStyle = primarySmallMedium;
                } else if (type === UIDetailsTable.CellType.Default || !type) {
                    textStyle = primarySmallRegular;
                }

                let cell;
                if (type === UIDetailsTable.CellType.NumberPercent) {
                    const [number, percent] = value.split('(');
                    cell = (
                        <Text>
                            <Text style={primarySmallRegular}>
                                {number}
                            </Text>
                            <Text style={secondarySmallRegular}>
                                {`(${percent}`}
                            </Text>
                        </Text>
                    );
                } else if (type === UIDetailsTable.CellType.Gram) {
                    const [integer, fractional] = value.split('.');
                    cell = (
                        <Text>
                            <Text style={primarySmallRegular}>
                                {integer}
                            </Text>
                            <Text style={secondarySmallRegular}>
                                {`.${fractional} ${UILocalized.gram}`}
                            </Text>
                        </Text>
                    );
                } else if (type === UIDetailsTable.CellType.Action) {
                    // actionSmallMedium;
                    cell = (
                        <TouchableOpacity onPress={() => this.navigateTo(screen)}>
                            <Text style={actionSmallMedium}>
                                {value}
                            </Text>
                        </TouchableOpacity>
                    );
                } else {
                    cell = (
                        <Text style={[textStyle, UIStyle.flex]}>
                            {value}
                        </Text>
                    );
                }
                return (
                    <View style={styles.row} key={`details-table-row-${name}-${value}`}>
                        <View style={[styles.leftCell, UIStyle.marginRightDefault]}>
                            <Text style={secondarySmallRegular}>
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
}

export default UIDetailsTable;

UIDetailsTable.defaultProps = {
    navigation: null,
    detailsList: {},
};
