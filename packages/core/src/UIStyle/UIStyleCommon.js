// @flow
import { StyleSheet } from 'react-native';

import { containerStyles } from './UIStyleContainer';
import { flexStyles } from './UIStyleFlex';

export const commonStyles = {
    opacity70: {
        opacity: 0.7,
    },

    ...containerStyles,
    ...flexStyles,
};

const styles = StyleSheet.create(commonStyles);

export default class UIStyleCommon {
    static flex() {
        return styles.flex1;
    }

    static flexColumn() {
        return styles.flexColumn;
    }

    static flexRow() {
        return styles.flexRow;
    }

    static alignCenter() {
        return styles.alignCenter;
    }

    static alignStart() {
        return styles.alignStart;
    }

    static justifyStart() {
        return styles.justifyStart;
    }

    static justifyCenter() {
        return styles.justifyCenter;
    }

    static alignJustifyCenter() {
        return styles.alignJustifyCenter;
    }

    static justifySpaceBetween() {
        return styles.justifySpaceBetween;
    }

    static justifyEnd() {
        return styles.justifyEnd;
    }

    static centerLeftContainer() {
        return styles.centerLeftContainer;
    }

    static opacity70() {
        return styles.opacity70;
    }
}
