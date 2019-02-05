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
        SecondaryImageCenterRightNoBottomBar: 'SecondaryImageCenterRightNoBottomBar',
        SecondaryImageBottomRight: 'SecondaryImageBottomRight',
    };

    static Presets = {
        [UIBackgroundView.PresetNames.SecondaryImageTopRight]: {
            backgroundStyle: {
                backgroundColor: UIColor.fa(),
                alignItems: 'flex-end',
            },
            image: '',
        },
        [UIBackgroundView.PresetNames.SecondaryImageBottomLeft]: {
            backgroundStyle: {
                backgroundColor: UIColor.fa(),
                justifyContent: 'flex-end',
            },
            image: '',
        },
        [UIBackgroundView.PresetNames.SecondaryImageCenterRightNoBottomBar]: {
            backgroundStyle: {
                backgroundColor: UIColor.fa(),
                alignItems: 'flex-end',
                justifyContent: 'center',
            },
            bottomBarDisabled: true,
            image: '',
        },
        [UIBackgroundView.PresetNames.SecondaryImageBottomRight]: {
            backgroundStyle: {
                backgroundColor: UIColor.fa(),
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
            },
            image: '',
        },
    };

    renderBottomBar(bottomBarDisabled: boolean) {
        return !bottomBarDisabled ? <UIBottomBar /> : null;
    }

    render() {
        const preset = UIBackgroundView.Presets[this.props.presetName];
        if (!preset) {
            return null;
        }
        const { backgroundStyle, bottomBarDisabled } = preset;
        return (
            <View style={[UIStyle.absoluteFillObject, { ...backgroundStyle }]}>
                <View style={UIStyle.backgroundImageContainer} />
                {this.renderBottomBar(bottomBarDisabled)}
            </View>
        );
    }

    static defaultProps: Props;
}

UIBackgroundView.defaultProps = {
    presetName: '',
};
