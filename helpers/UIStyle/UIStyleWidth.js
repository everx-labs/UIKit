import { StyleSheet } from 'react-native';
import { containerProps } from './UIStyleContainer';

export const widthProps = {
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
    ...containerProps,
};

const styles = StyleSheet.create(widthProps);

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
