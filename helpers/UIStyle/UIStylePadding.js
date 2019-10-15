import { StyleSheet } from 'react-native';
import UIConstant from '../UIConstant';

export const paddingProps = {
    paddingDefault: { // 16
        padding: UIConstant.contentOffset(),
    },
    paddingSmall: {
        padding: UIConstant.smallContentOffset(),
    },
    paddingHorizontal: {
        paddingHorizontal: UIConstant.contentOffset(),
    },
    paddingVertical: {
        paddingVertical: UIConstant.contentOffset(),
    },
    paddingVerticalNormal: {
        paddingVertical: UIConstant.normalContentOffset(),
    },
    paddingTopDefault: {
        paddingTop: UIConstant.contentOffset(),
    },
    paddingBottomSmall: {
        paddingBottom: UIConstant.smallContentOffset(),
    },
    paddingBottomMedium: {
        paddingBottom: UIConstant.mediumContentOffset(),
    },
    paddingBottomSpacious: { // 40
        paddingBottom: UIConstant.spaciousContentOffset(),
    },
    paddingBottomMassive: {
        paddingBottom: UIConstant.massiveContentOffset(),
    },
    paddingBottomMajor: { // 64
        paddingBottom: UIConstant.majorContentOffset(),
    },
    paddingBottomVast: {
        paddingBottom: UIConstant.vastContentOffset(),
    },
    paddingBottomEnormous: {
        paddingBottom: UIConstant.enormousContentOffset(),
    },
    paddingBottomGiant: { // 136
        paddingBottom: UIConstant.giantContentOffset(),
    },
    paddingBottomDefault: {
        paddingBottom: UIConstant.contentOffset(),
    },
    paddingRightDefault: {
        paddingRight: UIConstant.contentOffset(),
    },
    paddingRightHuge: {
        paddingRight: UIConstant.hugeContentOffset(),
    },
    paddingRightGreat: {
        paddingRight: UIConstant.greatContentOffset(),
    },
    paddingLeftDefault: {
        paddingLeft: UIConstant.contentOffset(),
    },
};

const styles = StyleSheet.create(paddingProps);

export default class UIStylePadding {
    static default() { // 16
        return styles.paddingDefault;
    }

    static small() {
        return styles.paddingSmall;
    }

    static horizontal() {
        return styles.paddingHorizontal;
    }

    static vertical() {
        return styles.paddingVertical;
    }

    static verticalNormal() {
        return styles.paddingVerticalNormal;
    }

    static topDefault() {
        return styles.paddingTopDefault;
    }

    static bottomSmall() {
        return styles.paddingBottomSmall;
    }

    static bottomDefault() {
        return styles.paddingBottomDefault;
    }

    static bottomSpacious() { // 40
        return styles.paddingBottomSpacious;
    }

    static bottomMassive() {
        return styles.paddingBottomMassive;
    }

    static bottomVast() {
        return styles.paddingBottomVast;
    }

    static bottomEnormous() {
        return styles.paddingBottomEnormous;
    }

    static bottomGiant() { // 136
        return styles.paddingBottomGiant;
    }

    static leftDefault() {
        return styles.paddingLeftDefault;
    }

    static rightDefault() {
        return styles.paddingRightDefault;
    }

    static rightHuge() {
        return styles.paddingRightHuge;
    }

    static rightGreat() {
        return styles.paddingRightGreat;
    }

    static bottomMedium() {
        return styles.paddingBottomMedium;
    }

    static bottomMajor() {
        return styles.paddingBottomMajor;
    }
}
