// @flow
import React from 'react';
import { Image } from 'react-native';

import UIActionComponent from '../../UIActionComponent';
import type { ActionProps } from '../../UIActionComponent';

type Props = ActionProps & {
    iconDisabled: string,
    iconEnabled: string,
    iconHovered: string,
};
type State = {};

export default class UIActionImage extends UIActionComponent<Props, State> {
    renderContent() {
        const {
            iconDisabled, iconHovered, iconEnabled, disabled,
        } = this.props;

        let source;
        if (disabled) {
            source = iconDisabled;
        } else if (this.isHover()) {
            source = iconHovered;
        } else {
            source = iconEnabled;
        }
        return (
            <Image
                source={source}
            />
        );
    }

    static defaultProps: Props;
}

UIActionImage.defaultProps = {
    ...UIActionComponent.defaultProps,
    iconDisabled: null,
    iconEnabled: null,
    iconHovered: null,
};
