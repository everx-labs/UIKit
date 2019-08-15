// @flow
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import UIStyle from '../../../helpers/UIStyle';
import UIConstant from '../../../helpers/UIConstant';

type Props = {
    children: string,
    level?: number,
    bullet?: string,
};

const styles = StyleSheet.create({
    bulletWideContainer: {
        width: UIConstant.greatContentOffset(),
    },
    bulletSlimContainer: {
        width: UIConstant.hugeContentOffset(),
    },
});

const UIBullet = ({ children, level = 1, bullet = '—' }: Props) => {
    const shift = level > 1
        ? <View style={[UIStyle.Margin.rightDefault(), UIStyle.Margin.leftGreat()]} />
        : null;
    const bulletStyle = bullet.length >= 4
        ? styles.bulletWideContainer
        : styles.bulletSlimContainer;
    return (
        <View style={[UIStyle.Common.flexRow(), UIStyle.Margin.topDefault()]}>
            {shift}
            <Text style={[
                UIStyle.Text.quaternarySmallRegular(),
                bulletStyle,
            ]}
            >
                {bullet}
            </Text>
            <Text style={[
                UIStyle.Text.secondarySmallRegular(),
                UIStyle.Common.flex(),
            ]}
            >
                {children}
            </Text>
        </View>
    );
};

UIBullet.defaultProps = {
    level: 1,
    bullet: '—',
};

export { UIBullet as default };
