// @flow
import React from 'react';
import { View } from 'react-native';

import UIColor from '../../../helpers/UIColor';

type Props = {
    error?: boolean,
}

const UISeparator = (props: Props) => {
    const backgroundColor = props.error ? UIColor.error() : UIColor.light();
    return <View style={{ height: 1, backgroundColor }} />;
};

export default UISeparator;

UISeparator.defaultProps = {
    error: false,
};
