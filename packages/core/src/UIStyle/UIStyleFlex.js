// @flow
import { StyleSheet } from 'react-native';

import { containerStyles } from './UIStyleContainer';

export const flexStyles = {
    flex1: {
        flex: 1,
    },
    flexRow: {
        flexDirection: 'row',
    },
    flexColumn: {
        flexDirection: 'column',
    },
    alignCenter: {
        alignItems: 'center',
    },
    alignStart: {
        alignItems: 'flex-start',
    },
    justifyStart: {
        justifyContent: 'flex-start',
    },
    justifyCenter: {
        justifyContent: 'center',
    },
    alignJustifyCenter: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    justifySpaceBetween: {
        justifyContent: 'space-between',
    },
    justifyEnd: {
        justifyContent: 'flex-end',
    },
    ...containerStyles,
};

const styles = StyleSheet.create(flexStyles);

export default class UIStyleFlex {
    static x1() {
        return styles.flex1;
    }

    static column() {
        return styles.flexColumn;
    }

    static row() {
        return styles.flexRow;
    }

    static alignCenter() {
        return styles.alignCenter;
    }

    static alignJustifyCenter() {
        return styles.alignJustifyCenter;
    }

    static justifySpaceBetween() {
        return styles.justifySpaceBetween;
    }
}
