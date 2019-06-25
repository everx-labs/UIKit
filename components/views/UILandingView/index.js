// @flow
import React from 'react';
import { Image, StyleSheet } from 'react-native';

import type { ImageSource } from 'react-native/Libraries/Image/ImageSource';

import UIStyle from '../../../helpers/UIStyle';
import UILabel from '../../text/UILabel';
import UIComponent from '../../UIComponent';

type Props = {
    icon: ImageSource,
    title: string,
    description: string,
    testID?: string,
};

type State = {};

const iconSize = 128;
const descriptionMaxHeight = 152;

const styles = StyleSheet.create({
    icon: {
        width: iconSize,
        height: iconSize,
    },
    descriptionLabel: {
        flex: 1,
        maxHeight: descriptionMaxHeight,
    },
});

export default class UILandingView extends UIComponent<Props, State> {
    // Render
    render() {
        const {
            icon, title, description, testID,
        } = this.props;
        const testIDProp = testID ? { testID } : null;
        return (
            <React.Fragment {...testIDProp} >
                <Image
                    style={styles.icon}
                    source={icon}
                />
                <UILabel
                    style={UIStyle.Margin.topDefault()}
                    role={UILabel.Role.Subtitle}
                    text={title}
                />
                <UILabel
                    style={[
                        UIStyle.Margin.topSmall(),
                        styles.descriptionLabel,
                    ]}
                    useDefaultSpace
                    role={UILabel.Role.Description}
                    text={description}
                />
            </React.Fragment>
        );
    }
}
