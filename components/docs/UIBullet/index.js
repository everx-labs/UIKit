// @flow
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIStyle from '../../../helpers/UIStyle';
import UIConstant from '../../../helpers/UIConstant';

type Props = {
    children: string,
    level?: number,
    bullet?: string,
    bulletStyle?: ViewStyleProp,
};

const styles = StyleSheet.create({
    bulletWideContainer: {
        width: UIConstant.greatContentOffset(),
    },
    bulletSlimContainer: {
        width: UIConstant.hugeContentOffset(),
    },
});

const UIBullet = ({
    children, level = 1, bullet = '—', bulletStyle,
}: Props) => {
    const shift = level > 1
        ? <View style={[UIStyle.margin.rightDefault(), UIStyle.margin.leftGreat()]} />
        : null;
    const customBulletStyle = bulletStyle
        || (bullet.length >= 4 ? styles.bulletWideContainer : styles.bulletSlimContainer);
    return (
        <View style={[UIStyle.common.flexRow(), UIStyle.margin.topDefault()]}>
            {shift}
            <Text style={[
                UIStyle.Text.quaternarySmallRegular(),
                customBulletStyle,
            ]}
            >
                {bullet}
            </Text>
            <Text style={[
                UIStyle.Text.secondarySmallRegular(),
                UIStyle.common.flex(),
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
    bulletStyle: {},
};

export { UIBullet as default };
