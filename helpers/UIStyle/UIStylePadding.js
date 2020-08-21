// @flow
import { StyleSheet } from 'react-native';
import UIConstant from '../UIConstant';

export const paddingStyles = {
    paddingDefault: { // 16
        padding: UIConstant.contentOffset(),
    },
    paddingTiny: { // 4
        padding: UIConstant.tinyContentOffset(),
    },
    paddingSmall: { // 8
        padding: UIConstant.smallContentOffset(),
    },
    paddingHorizontalTiny: { // 4
        paddingHorizontal: UIConstant.tinyContentOffset(),
    },
    paddingHorizontal: { // 16
        paddingHorizontal: UIConstant.contentOffset(),
    },
    paddingHorizontalNormal: { // 12
        paddingHorizontal: UIConstant.normalContentOffset(),
    },
    paddingVerticalTiny: { // 4
        paddingVertical: UIConstant.tinyContentOffset(),
    },
    paddingVertical: {
        paddingVertical: UIConstant.contentOffset(),
    },
    paddingVerticalNormal: {
        paddingVertical: UIConstant.normalContentOffset(),
    },
    paddingTopDefault: { // 16
        paddingTop: UIConstant.contentOffset(),
    },
    paddingTopTiny: { // 4
        paddingTop: UIConstant.smallContentOffset(),
    },
    paddingTopSmall: { // 8
        paddingTop: UIConstant.smallContentOffset(),
    },
    paddingTopHuge: { // 32
        paddingTop: UIConstant.hugeContentOffset(),
    },
    paddingBottomTiny: { // 4
        paddingBottom: UIConstant.tinyContentOffset(),
    },
    paddingBottomSmall: { // 8
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
    paddingBottomNormal: {
        paddingBottom: UIConstant.normalContentOffset(),
    },
    paddingBottomDefault: {
        paddingBottom: UIConstant.contentOffset(),
    },
    paddingBottomHuge: {
        paddingBottom: UIConstant.hugeContentOffset(),
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

const styles = StyleSheet.create(paddingStyles);

export default class UIStylePadding {
    static default() { // 16
        return styles.paddingDefault;
    }

    static tiny() { // 4
        return styles.paddingTiny;
    }

    static small() { // 8
        return styles.paddingSmall;
    }

    static horizontalTiny() {
        return styles.paddingHorizontalTiny;
    }

    static horizontal() {
        return styles.paddingHorizontal;
    }

    static horizontalNormal() {
        return styles.paddingHorizontalNormal;
    }

    static verticalTiny() {
        return styles.paddingVerticalTiny;
    }

    static vertical() {
        return styles.paddingVertical;
    }

    static verticalNormal() {
        return styles.paddingVerticalNormal;
    }

    static topTiny() { // 4
        return styles.paddingTopTiny;
    }

    static topSmall() { // 8
        return styles.paddingTopSmall;
    }

    static topDefault() { // 16
        return styles.paddingTopDefault;
    }

    static topHuge() { // 32
        return styles.paddingTopHuge;
    }

    static bottomTiny() {
        return styles.paddingBottomTiny;
    }

    static bottomSmall() {
        return styles.paddingBottomSmall;
    }

    static bottomNormal() {
        return styles.paddingBottomNormal;
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

    static bottomHuge() {
        return styles.paddingBottomHuge;
    }

    static bottomMajor() {
        return styles.paddingBottomMajor;
    }
}
