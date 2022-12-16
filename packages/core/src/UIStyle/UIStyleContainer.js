// @flow
import { StyleSheet } from 'react-native';

import UIConstant from '../UIConstant';

const absoluteFillContainer = {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
};

const absoluteFillObject = {
    ...absoluteFillContainer,
    overflow: 'hidden',
};

const pageContainer = {
    paddingHorizontal: UIConstant.contentOffset(),
    width: '100%',
    alignSelf: 'center',
};

export const containerStyles = {
    centerLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    absoluteFillObject: {
        // has { overflow: hidden }
        ...absoluteFillObject,
    },
    screenBackground: {
        ...absoluteFillObject,
    },
    screenContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    pageContainer: {
        ...pageContainer,
        maxWidth: UIConstant.elasticWidthMax(),
    },
};

const styles = StyleSheet.create(containerStyles);

export default class UIStyleContainer {
    static screen() {
        return styles.screenContainer;
    }

    static page() {
        return styles.pageContainer;
    }

    static centerLeft() {
        return styles.centerLeftContainer;
    }

    static screenBackground() {
        return styles.screenBackground;
    }
}
