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
    bulletStyle?: ?ViewStyleProp,
};

export const styles = StyleSheet.create({
    wideContainer: {
        width: UIConstant.majorContentOffset(),
    },
    mediumContainer: {
        width: UIConstant.greatContentOffset(),
    },
    slimContainer: {
        width: UIConstant.hugeContentOffset(),
    },
});

const getBulletWidthStyle = (len) => {
    if (len >= 6) {
        return styles.wideContainer;
    }
    if (len >= 4) {
        return styles.mediumContainer;
    }
    return styles.slimContainer;
};

const UIBullet = ({
    children, level = 1, bullet = '—', bulletStyle,
}: Props) => {
    const shift = level > 1
        ? <View style={[UIStyle.margin.rightDefault(), UIStyle.margin.leftGreat()]} />
        : null;
    const customBulletStyle = bulletStyle || getBulletWidthStyle(bullet.length);
    return (
        <View style={[UIStyle.common.flexRow(), UIStyle.margin.topDefault()]}>
            {shift}
            <Text style={[UIStyle.text.quaternarySmallRegular(), customBulletStyle]}>
                {bullet}
            </Text>
            <Text style={[UIStyle.text.secondarySmallRegular(), UIStyle.common.flex()]}>
                {children}
            </Text>
        </View>
    );
};

UIBullet.styles = styles;

UIBullet.defaultProps = {
    level: 1,
    bullet: '—',
    bulletStyle: null,
};

export { UIBullet as default };
