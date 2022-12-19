// @flow
import { StyleSheet } from 'react-native';

import UIConstant from '../UIConstant';

export const marginStyles = {
    marginTopTiny: {
        // 4
        marginTop: UIConstant.tinyContentOffset(),
    },
    marginTopSmall: {
        // 8
        marginTop: UIConstant.smallContentOffset(),
    },
    marginTopNormal: {
        // 12
        marginTop: UIConstant.normalContentOffset(),
    },
    marginTopDefault: {
        // 16
        marginTop: UIConstant.contentOffset(),
    },
    marginTopMedium: {
        // 24
        marginTop: UIConstant.mediumContentOffset(),
    },
    marginTopHuge: {
        // 32
        marginTop: UIConstant.hugeContentOffset(),
    },
    marginTopGreat: {
        // 48
        marginTop: UIConstant.greatContentOffset(),
    },
    marginTopBig: {
        // 56
        marginTop: UIConstant.bigCellHeight(),
    },
    marginBottomTiny: {
        // 4
        marginBottom: UIConstant.tinyContentOffset(),
    },
    marginBottomSmall: {
        // 8
        marginBottom: UIConstant.smallContentOffset(),
    },
    marginBottomNormal: {
        // 12
        marginBottom: UIConstant.normalContentOffset(),
    },
    marginBottomDefault: {
        // 16
        marginBottom: UIConstant.contentOffset(),
    },
    marginBottomMedium: {
        // 24
        marginBottom: UIConstant.mediumContentOffset(),
    },
    marginBottomHuge: {
        // 32
        marginBottom: UIConstant.hugeContentOffset(),
    },
    marginBottomGreat: {
        // 48
        marginBottom: UIConstant.greatContentOffset(),
    },
    marginRightTiny: {
        // 4
        marginRight: UIConstant.tinyContentOffset(),
    },
    marginRightSmall: {
        // 8
        marginRight: UIConstant.smallContentOffset(),
    },
    marginRightDefault: {
        // 16
        marginRight: UIConstant.contentOffset(),
    },
    marginLeftTiny: {
        // 4
        marginLeft: UIConstant.tinyContentOffset(),
    },
    marginLeftSmall: {
        // 8
        marginLeft: UIConstant.smallContentOffset(),
    },
    marginLeftNormal: {
        // 12
        marginLeft: UIConstant.normalContentOffset(),
    },
    marginLeftDefault: {
        // 16
        marginLeft: UIConstant.contentOffset(),
    },
    marginHorizontalSmallOffset: {
        marginLeft: UIConstant.smallContentOffset(),
        marginRight: UIConstant.smallContentOffset(),
    },
};

const styles = StyleSheet.create(marginStyles);

export default class UIStyleMargin {
    // Top

    static topTiny() {
        // 4
        return styles.marginTopTiny;
    }

    static topSmall() {
        // 8
        return styles.marginTopSmall;
    }

    static topNormal() {
        // 12
        return styles.marginTopNormal;
    }

    static topDefault() {
        // 16
        return styles.marginTopDefault;
    }

    static topMedium() {
        // 24
        return styles.marginTopMedium;
    }

    static topHuge() {
        // 32
        return styles.marginTopHuge;
    }

    static topGreat() {
        // 48
        return styles.marginTopGreat;
    }

    static topBig() {
        // 56
        return styles.marginTopBig;
    }

    // Bottom

    static bottomTiny() {
        // 4
        return styles.marginBottomTiny;
    }

    static bottomSmall() {
        // 8
        return styles.marginBottomSmall;
    }

    static bottomNormal() {
        // 12
        return styles.marginBottomNormal;
    }

    static bottomDefault() {
        // 16
        return styles.marginBottomDefault;
    }

    static bottomMedium() {
        // 24
        return styles.marginBottomMedium;
    }

    static bottomHuge() {
        // 32
        return styles.marginBottomHuge;
    }

    static bottomGreat() {
        // 48
        return styles.marginBottomGreat;
    }

    // Right

    static rightTiny() {
        // 4
        return styles.marginRightTiny;
    }

    static rightSmall() {
        // 8
        return styles.marginRightSmall;
    }

    static rightDefault() {
        // 16
        return styles.marginRightDefault;
    }

    // Left

    static leftTiny() {
        // 4
        return styles.marginLeftTiny;
    }

    static leftSmall() {
        // 8
        return styles.marginLeftSmall;
    }

    static leftNormal() {
        // 12
        return styles.marginLeftNormal;
    }

    static leftDefault() {
        // 16
        return styles.marginLeftDefault;
    }

    // Horizontal

    static horizontalSmallOffset() {
        // 8
        return styles.marginHorizontalSmallOffset;
    }
}
