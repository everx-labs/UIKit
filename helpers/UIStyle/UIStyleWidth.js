// @flow
import { StyleSheet } from 'react-native';
import { containerStyles } from './UIStyleContainer';

export const widthStyles = {
    fullWidth: {
        width: '100%',
    },
    threeQuartersWidth: {
        width: '75%',
    },
    twoThirdsWidth: {
        width: '66%',
    },
    halfWidth: {
        width: '50%',
    },
    thirdWidth: {
        width: '33%',
    },
    quarterWidth: {
        width: '25%',
    },
    ...containerStyles,
};

const styles = StyleSheet.create(widthStyles);

export default class UIStyleWidth {
    static full() {
        return styles.fullWidth;
    }

    static threeQuarters() {
        return styles.threeQuartersWidth;
    }

    static twothirds() {
        return styles.twoThirdsWidth;
    }

    static half() {
        return styles.halfWidth;
    }

    static third() {
        return styles.thirdWidth;
    }

    static quarter() {
        return styles.quarterWidth;
    }

    // Containers
    static fullCenterContainer() {
        return styles.fullWidthCenterContainer;
    }

    static fullPaddingContainer() {
        return styles.fullWidthPaddingContainer;
    }

    static halfContainer() {
        return styles.halfWidthContainer;
    }

    static twoThirdsContainer() {
        return styles.twoThirdsWidthContainer;
    }
}
