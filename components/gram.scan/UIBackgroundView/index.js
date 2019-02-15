// @flow
import React from 'react';
import { View } from 'react-native';

import UIComponent from '../../UIComponent';
import UIColor from '../../../helpers/UIColor';
import UIStyle from '../../../helpers/UIStyle';
import UIBottomBar from '../../gram.scan/UIBottomBar';

type Props = {
    presetName: string,
};

type State = {};

export default class UIBackgroundView extends UIComponent<Props, State> {
    static PresetNames = {
        SecondaryImageTopRight: 'SecondaryImageTopRight',
        SecondaryImageBottomLeft: 'SecondaryImageBottomLeft',
        SecondaryImageCenterRight: 'SecondaryImageCenterRight',
        SecondaryImageBottomRight: 'SecondaryImageBottomRight',
        Primary: 'Primary',
    };

    static Presets = {
        [UIBackgroundView.PresetNames.SecondaryImageTopRight]: {
            backgroundStyle: {
                backgroundColor: UIColor.fa(),
                alignItems: 'flex-end',
            },
            image: 'image',
        },
        [UIBackgroundView.PresetNames.SecondaryImageBottomLeft]: {
            backgroundStyle: {
                backgroundColor: UIColor.fa(),
                justifyContent: 'flex-end',
            },
            image: 'image',
        },
        [UIBackgroundView.PresetNames.SecondaryImageCenterRight]: {
            backgroundStyle: {
                backgroundColor: UIColor.fa(),
                alignItems: 'flex-end',
                justifyContent: 'center',
            },
            image: 'image',
        },
        [UIBackgroundView.PresetNames.SecondaryImageBottomRight]: {
            backgroundStyle: {
                backgroundColor: UIColor.fa(),
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
            },
            image: 'image',
        },
        [UIBackgroundView.PresetNames.Primary]: {
            backgroundStyle: {
                backgroundColor: UIColor.backgroundPrimary(),
            },
            image: null,
        },
    };

    render() {
        const preset = UIBackgroundView.Presets[this.props.presetName];
        if (!preset) {
            return null;
        }
        const { backgroundStyle, image } = preset;
        const imageView = image ? <View style={UIStyle.backgroundImageContainer} /> : null;
        return (
            <View style={[UIStyle.absoluteFillObject, { ...backgroundStyle }]}>
                {imageView}
            </View>
        );
    }

    static defaultProps: Props;
}

UIBackgroundView.defaultProps = {
    presetName: '',
};
