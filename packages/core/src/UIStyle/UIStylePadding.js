// @flow
import { StyleSheet } from 'react-native';
import UIConstant from '../UIConstant';

export const paddingStyles = {
    paddingNone: {
        padding: 0,
    },
    paddingHorizontalNone: {
        paddingHorizontal: 0,
    },
    paddingVerticalNone: {
        paddingVertical: 0,
    },
    paddingDefault: {
        // 16
        padding: UIConstant.contentOffset(),
    },
    paddingTiny: {
        // 4
        padding: UIConstant.tinyContentOffset(),
    },
    paddingSmall: {
        // 8
        padding: UIConstant.smallContentOffset(),
    },
    paddingHorizontalTiny: {
        // 4
        paddingHorizontal: UIConstant.tinyContentOffset(),
    },
    paddingHorizontalSmall: {
        // 8
        paddingHorizontal: UIConstant.smallContentOffset(),
    },
    paddingHorizontal: {
        // 16
        paddingHorizontal: UIConstant.contentOffset(),
    },
    paddingHorizontalNormal: {
        // 12
        paddingHorizontal: UIConstant.normalContentOffset(),
    },
    paddingVerticalTiny: {
        // 4
        paddingVertical: UIConstant.tinyContentOffset(),
    },
    paddingVertical: {
        paddingVertical: UIConstant.contentOffset(),
    },
    paddingVerticalNormal: {
        paddingVertical: UIConstant.normalContentOffset(),
    },
    paddingVerticalSmall: {
        paddingVertical: UIConstant.smallContentOffset(),
    },
    paddingTopDefault: {
        // 16
        paddingTop: UIConstant.contentOffset(),
    },
    paddingTopTiny: {
        // 4
        paddingTop: UIConstant.tinyContentOffset(),
    },
    paddingTopSmall: {
        // 8
        paddingTop: UIConstant.smallContentOffset(),
    },
    paddingTopMedium: {
        // 24
        paddingTop: UIConstant.mediumContentOffset(),
    },
    paddingTopHuge: {
        // 32
        paddingTop: UIConstant.hugeContentOffset(),
    },
    paddingBottomTiny: {
        // 4
        paddingBottom: UIConstant.tinyContentOffset(),
    },
    paddingBottomSmall: {
        // 8
        paddingBottom: UIConstant.smallContentOffset(),
    },
    paddingBottomMedium: {
        paddingBottom: UIConstant.mediumContentOffset(),
    },
    paddingBottomSpacious: {
        // 40
        paddingBottom: UIConstant.spaciousContentOffset(),
    },
    paddingBottomMassive: {
        paddingBottom: UIConstant.massiveContentOffset(),
    },
    paddingBottomMajor: {
        // 64
        paddingBottom: UIConstant.majorContentOffset(),
    },
    paddingBottomVast: {
        paddingBottom: UIConstant.vastContentOffset(),
    },
    paddingBottomEnormous: {
        paddingBottom: UIConstant.enormousContentOffset(),
    },
    paddingBottomGiant: {
        // 136
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
    paddingRightSmall: {
        paddingRight: UIConstant.smallContentOffset(),
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
    paddingLeftSmall: {
        paddingLeft: UIConstant.smallContentOffset(),
    },
    paddingLeftDefault: {
        paddingLeft: UIConstant.contentOffset(),
    },
};

const styles = StyleSheet.create(paddingStyles);

export default class UIStylePadding {
    static none() {
        // 0
        return styles.paddingNone;
    }

    static default() {
        // 16
        return styles.paddingDefault;
    }

    static tiny() {
        // 4
        return styles.paddingTiny;
    }

    static small() {
        // 8
        return styles.paddingSmall;
    }

    static horizontalNone() {
        // 0
        return styles.paddingHorizontalNone;
    }

    static horizontal() {
        // 16
        return styles.paddingHorizontal;
    }

    static horizontalTiny() {
        // 4
        return styles.paddingHorizontalTiny;
    }

    static horizontalSmall() {
        // 8
        return styles.paddingHorizontalSmall;
    }

    static horizontalNormal() {
        // 12
        return styles.paddingHorizontalNormal;
    }

    static verticalNone() {
        // 0
        return styles.paddingVerticalNone;
    }

    static vertical() {
        // 16
        return styles.paddingVertical;
    }

    static verticalTiny() {
        // 4
        return styles.paddingVerticalTiny;
    }

    static verticalSmall() {
        // 8
        return styles.paddingVerticalSmall;
    }

    static verticalNormal() {
        // 12
        return styles.paddingVerticalNormal;
    }

    static topTiny() {
        // 4
        return styles.paddingTopTiny;
    }

    static topSmall() {
        // 8
        return styles.paddingTopSmall;
    }

    static topDefault() {
        // 16
        return styles.paddingTopDefault;
    }

    static topMedium() {
        // 24
        return styles.paddingTopMedium;
    }

    static topHuge() {
        // 32
        return styles.paddingTopHuge;
    }

    static bottomTiny() {
        // 4
        return styles.paddingBottomTiny;
    }

    static bottomSmall() {
        // 8
        return styles.paddingBottomSmall;
    }

    static bottomNormal() {
        // 12
        return styles.paddingBottomNormal;
    }

    static bottomDefault() {
        // 16
        return styles.paddingBottomDefault;
    }

    static bottomSpacious() {
        // 40
        return styles.paddingBottomSpacious;
    }

    static bottomMassive() {
        // 72
        return styles.paddingBottomMassive;
    }

    static bottomVast() {
        // 80
        return styles.paddingBottomVast;
    }

    static bottomEnormous() {
        // 104
        return styles.paddingBottomEnormous;
    }

    static bottomGiant() {
        // 136
        return styles.paddingBottomGiant;
    }

    static leftSmall() {
        // 8
        return styles.paddingLeftSmall;
    }

    static leftDefault() {
        // 16
        return styles.paddingLeftDefault;
    }

    static rightSmall() {
        // 8
        return styles.paddingRightSmall;
    }

    static rightDefault() {
        // 16
        return styles.paddingRightDefault;
    }

    static rightHuge() {
        // 32
        return styles.paddingRightHuge;
    }

    static rightGreat() {
        // 48
        return styles.paddingRightGreat;
    }

    static bottomMedium() {
        // 24
        return styles.paddingBottomMedium;
    }

    static bottomHuge() {
        // 32
        return styles.paddingBottomHuge;
    }

    static bottomMajor() {
        // 64
        return styles.paddingBottomMajor;
    }
}
