// @flow
import React from 'react';
import { View, Text } from 'react-native';

import UIStyle from '../../../helpers/UIStyle';

type Props = {
    children: string,
    level?: number,
    bullet?: string,
};

const UIBullet = ({ children, level = 1, bullet = '—' }: Props) => {
    const shift = level > 1
        ? <View style={[UIStyle.Margin.rightDefault(), UIStyle.Margin.leftGreat()]} />
        : null;
    return (
        <View style={[UIStyle.Common.flexRow(), UIStyle.Margin.topDefault()]}>
            {shift}
            <Text style={[
                UIStyle.Text.quaternarySmallRegular(),
                UIStyle.Margin.rightDefault(),
            ]}
            >
                {bullet}
            </Text>
            <Text style={UIStyle.Text.secondarySmallRegular()}>
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
