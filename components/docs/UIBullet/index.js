// @flow
import React from 'react';
import { View } from 'react-native';

import UILabel from '../../text/UILabel';
import UIStyle from '../../../helpers/UIStyle';

type Props = {
    children: React$Node,
    level?: number,
    bullet?: string,
};

const UIBullet = ({ children, level, bullet }: Props) => {
    const shift = level > 1
        ? <View style={[UIStyle.Margin.rightDefault(), UIStyle.Margin.leftGreat()]} />
        : null;
    const role = level > 1 ? UILabel.Role.Description : UILabel.Role.BoldDescription;
    return (
        <View style={[UIStyle.Common.flexRow(), UIStyle.Margin.topDefault()]}>
            {shift}
            <UILabel
                style={[UIStyle.Margin.rightDefault(), UIStyle.Margin.leftGreat()]}
                role={role}
                text={bullet}
            />
            <UILabel
                role={UILabel.Role.Description}
                text={children}
            />
        </View>
    );
};

UIBullet.defaultProps = {
    level: 1,
    bullet: '•',
};

export { UIBullet as default };
