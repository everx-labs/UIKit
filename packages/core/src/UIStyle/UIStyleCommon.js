// @flow
import { StyleSheet } from 'react-native';
import UIConstant from '../UIConstant';
import { containerStyles } from './UIStyleContainer';
import { flexStyles } from './UIStyleFlex';

export const commonStyles = {
    opacity70: {
        opacity: 0.7,
    },

    icon: {
        width: UIConstant.iconSize(),
        height: UIConstant.iconSize(),
    },

    positionAbsolute: {
        position: 'absolute',
    },

    ...containerStyles,
    ...flexStyles,
};

const styles = StyleSheet.create(commonStyles);

export default class UIStyleCommon {
    static flex() {
        return styles.flex1;
    }

    static flex2() {
        return styles.flex2;
    }

    static flex3() {
        return styles.flex3;
    }

    static flexColumn() {
        return styles.flexColumn;
    }

    static flexRow() {
        return styles.flexRow;
    }

    static flexRowWrap() {
        return styles.flexRowWrap;
    }

    static alignCenter() {
        return styles.alignCenter;
    }

    static alignSelfCenter() {
        return styles.alignSelfCenter;
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

    // Containers
    // deprecated, use UIStyle.Container
    static absoluteFillContainer() {
        return styles.absoluteFillContainer;
    }

    // deprecated, use UIStyle.Container
    static fullWidthPaddingContainer() {
        return styles.fullWidthPaddingContainer;
    }

    // deprecated, use UIStyle.Container
    static fullWidthPaddingCenterContainer() {
        return styles.fullWidthPaddingCenterContainer;
    }

    // deprecated, use UIStyle.Container
    static pageContainer() {
        return styles.pageContainer;
    }

    // deprecated, use UIStyle.Container
    static pageNormalContainer() {
        return styles.pageNormalContainer;
    }

    // deprecated, use UIStyle.Container
    static pageSlimContainer() {
        return styles.pageSlimContainer;
    }

    // deprecated, use UIStyle.Container
    static bottomScreenContainer() {
        return styles.bottomScreenContainer;
    }

    // deprecated, use UIStyle.Container
    static bottomOffsetScreenContainer() {
        return styles.bottomOffsetScreenContainer;
    }

    // deprecated, use UIStyle.Container
    static leftScreenContainer() {
        return styles.leftScreenContainer;
    }

    // deprecated, use UIStyle.Container
    static rightScreenContainer() {
        return styles.rightScreenContainer;
    }

    // deprecated, use UIStyle.Container
    static centerContainer() {
        return styles.centerContainer;
    }

    // deprecated, use UIStyle.Container
    static centerLeftContainer() {
        return styles.centerLeftContainer;
    }

    // deprecated, use UIStyle.Container
    static centerRightContainer() {
        return styles.centerRightContainer;
    }

    // deprecated, use UIStyle.Container
    static rowSpaceContainer() {
        return styles.rowSpaceContainer;
    }

    // deprecated, use UIStyle.Container
    static rowCenterSpaceContainer() {
        return styles.rowCenterSpaceContainer;
    }

    static opacity70() {
        return styles.opacity70;
    }

    // other
    static positionAbsolute() {
        return styles.positionAbsolute;
    }

    static absoluteFillObject() {
        return styles.absoluteFillObject;
    }

    static absoluteFillWidthContainer() {
        return styles.absoluteFillWidthContainer;
    }

    // custom
    static icon() {
        return styles.icon;
    }
}
