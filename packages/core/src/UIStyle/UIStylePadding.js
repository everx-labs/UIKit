// @flow
import { StyleSheet } from 'react-native';

import UIConstant from '../UIConstant';

export const paddingStyles = {
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
    paddingTopHuge: {
        // 32
        paddingTop: UIConstant.hugeContentOffset(),
    },
    paddingBottomMedium: {
        paddingBottom: UIConstant.mediumContentOffset(),
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
    paddingLeftSmall: {
        paddingLeft: UIConstant.smallContentOffset(),
    },
    paddingLeftDefault: {
        paddingLeft: UIConstant.contentOffset(),
    },
};

const styles = StyleSheet.create(paddingStyles);

export default class UIStylePadding {
    static horizontal() {
        // 16
        return styles.paddingHorizontal;
    }

    static horizontalSmall() {
        // 8
        return styles.paddingHorizontalSmall;
    }

    static horizontalNormal() {
        // 12
        return styles.paddingHorizontalNormal;
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

    static topHuge() {
        // 32
        return styles.paddingTopHuge;
    }

    static bottomNormal() {
        // 12
        return styles.paddingBottomNormal;
    }

    static bottomDefault() {
        // 16
        return styles.paddingBottomDefault;
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

    static bottomMedium() {
        // 24
        return styles.paddingBottomMedium;
    }

    static bottomHuge() {
        // 32
        return styles.paddingBottomHuge;
    }
}
