// @flow
import { StyleSheet } from 'react-native';
import { containerStyles } from './UIStyleContainer';

export const flexStyles = {
    flex1: {
        flex: 1,
    },
    flex2: {
        flex: 2,
    },
    flex3: {
        flex: 3,
    },
    flexRow: {
        flexDirection: 'row',
    },
    flexRowReverse: {
        flexDirection: 'row-reverse',
    },
    flexColumn: {
        flexDirection: 'column',
    },
    flexRowWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    alignCenter: {
        alignItems: 'center',
    },
    alignSelfCenter: {
        alignSelf: 'center',
    },
    alignSelfEnd: {
        alignSelf: 'flex-end',
    },
    alignEnd: {
        alignItems: 'flex-end',
    },
    alignStart: {
        alignItems: 'flex-start',
    },
    textAlignCenter: {
        textAlign: 'center',
    },
    textAlignRight: {
        textAlign: 'right',
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
    flexAlignCenter: {
        flex: 1,
        alignItems: 'center',
    },
    flexJustifyCenter: {
        flex: 1,
        justifyContent: 'center',
    },
    flexJustifyEnd: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    ...containerStyles,
};

const styles = StyleSheet.create(flexStyles);

export default class UIStyleFlex {
    static x1() {
        return styles.flex1;
    }

    static x2() {
        return styles.flex2;
    }

    static x3() {
        return styles.flex3;
    }

    static column() {
        return styles.flexColumn;
    }

    static row() {
        return styles.flexRow;
    }

    static rowReverse() {
        return styles.flexRowReverse;
    }

    static rowWrap() {
        return styles.flexRowWrap;
    }

    static alignCenter() {
        return styles.alignCenter;
    }

    static alignSelfCenter() {
        return styles.alignSelfCenter;
    }

    static alignSelfEnd() {
        return styles.alignSelfEnd;
    }

    static alignEnd() {
        return styles.alignEnd;
    }

    static alignStart() {
        return styles.alignStart;
    }

    static textAlignCenter() {
        return styles.textAlignCenter;
    }

    static textAlignRight() {
        return styles.textAlignRight;
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

    static flexAlignCenter() {
        return styles.flexAlignCenter;
    }

    static flexJustifyCenter() {
        return styles.flexJustifyCenter;
    }

    static flexJustifyEnd() {
        return styles.flexJustifyEnd;
    }

    static center() {
        return styles.centerContainer;
    }

    static centerLeft() {
        return styles.centerLeftContainer;
    }

    static centerRight() {
        return styles.centerRightContainer;
    }

    static rowSpace() {
        return styles.rowSpaceContainer;
    }

    static rowCenterSpace() {
        return styles.rowCenterSpaceContainer;
    }
}
