// @flow
import { StyleSheet } from 'react-native';
import UIConstant from '../UIConstant';

export const marginStyles = {
    leftGreat: {
        marginLeft: UIConstant.greatContentOffset(),
    },
    leftMajor: {
        marginLeft: UIConstant.majorContentOffset(),
    },
    rightGreat: {
        marginRight: UIConstant.greatContentOffset(),
    },
    rightMajor: {
        marginRight: UIConstant.majorContentOffset(),
    },

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
    marginTopSpacious: {
        // 40
        marginTop: UIConstant.spaciousContentOffset(),
    },
    marginTopGreat: {
        // 48
        marginTop: UIConstant.greatContentOffset(),
    },
    marginTopBig: {
        // 56
        marginTop: UIConstant.bigCellHeight(),
    },
    marginTopMajor: {
        // 64
        marginTop: UIConstant.majorContentOffset(),
    },
    marginTopMassive: {
        // 72
        marginTop: UIConstant.massiveContentOffset(),
    },
    marginTopVast: {
        // 80
        marginTop: UIConstant.vastContentOffset(),
    },
    marginTopTremendous: {
        // 96
        marginTop: UIConstant.tremendousContentOffset(),
    },
    marginTopEnormous: {
        // 104
        marginTop: UIConstant.enormousContentOffset(),
    },
    marginTopGiant: {
        // 136
        marginTop: UIConstant.giantContentOffset(),
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
    marginBottomMajor: {
        // 64
        marginBottom: UIConstant.majorContentOffset(),
    },
    marginBottomMassive: {
        // 72
        marginBottom: UIConstant.massiveContentOffset(),
    },
    marginBottomVast: {
        // 80
        marginBottom: UIConstant.vastContentOffset(),
    },
    marginBottomGiant: {
        // 136
        marginBottom: UIConstant.giantContentOffset(),
    },

    marginRightTiny: {
        // 4
        marginRight: UIConstant.tinyContentOffset(),
    },
    marginRightSmall: {
        // 8
        marginRight: UIConstant.smallContentOffset(),
    },
    marginRightNormal: {
        // 12
        marginRight: UIConstant.normalContentOffset(),
    },
    marginRightDefault: {
        // 16
        marginRight: UIConstant.contentOffset(),
    },
    marginRightMedium: {
        // 24
        marginRight: UIConstant.mediumContentOffset(),
    },
    marginRightHuge: {
        // 32
        marginRight: UIConstant.hugeContentOffset(),
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
    marginLeftMedium: {
        // 24
        marginLeft: UIConstant.mediumContentOffset(),
    },
    marginLeftHuge: {
        // 32
        marginLeft: UIConstant.hugeContentOffset(),
    },

    marginHorizontalOffset: {
        // 16
        marginLeft: UIConstant.contentOffset(),
        marginRight: UIConstant.contentOffset(),
    },
    marginHorizontalNegativeOffset: {
        marginHorizontal: -UIConstant.contentOffset(),
    },
    marginHorizontalMediumOffset: {
        marginLeft: UIConstant.mediumContentOffset(),
        marginRight: UIConstant.mediumContentOffset(),
    },
    marginHorizontalSmallOffset: {
        marginLeft: UIConstant.smallContentOffset(),
        marginRight: UIConstant.smallContentOffset(),
    },
    marginHorizontalTinyOffset: {
        marginLeft: UIConstant.tinyContentOffset(),
        marginRight: UIConstant.tinyContentOffset(),
    },

    marginDefault: {
        // 16
        margin: UIConstant.contentOffset(),
    },

    marginLeftRight: {
        marginLeft: UIConstant.contentOffset(),
        marginRight: UIConstant.contentOffset(),
        marginBottom: UIConstant.contentOffset(),
    },
    none: {
        margin: 0,
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
    static topSpacious() {
        // 40
        return styles.marginTopSpacious;
    }
    static topGreat() {
        // 48
        return styles.marginTopGreat;
    }
    static topBig() {
        // 56
        return styles.marginTopBig;
    }
    static topMajor() {
        // 64
        return styles.marginTopMajor;
    }
    static topMassive() {
        // 72
        return styles.marginTopMassive;
    }
    static topVast() {
        // 80
        return styles.marginTopVast;
    }
    static topTremendous() {
        // 96
        return styles.marginTopTremendous;
    }
    static topEnormous() {
        // 104
        return styles.marginTopEnormous;
    }
    static topGiant() {
        // 136
        return styles.marginTopGiant;
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
    static bottomMajor() {
        // 64
        return styles.marginBottomMajor;
    }
    static bottomMassive() {
        // 72
        return styles.marginBottomMassive;
    }
    static bottomVast() {
        // 80
        return styles.marginBottomVast;
    }
    static bottomGiant() {
        // 136
        return styles.marginBottomGiant;
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
    static rightNormal() {
        // 12
        return styles.marginRightNormal;
    }
    static rightDefault() {
        // 16
        return styles.marginRightDefault;
    }
    static rightMedium() {
        // 24
        return styles.marginRightMedium;
    }
    static rightHuge() {
        // 32
        return styles.marginRightHuge;
    }
    static rightGreat() {
        // 48
        return styles.rightGreat;
    }
    static rightMajor() {
        // 64
        return styles.rightMajor;
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
    static leftMedium() {
        // 24
        return styles.marginLeftMedium;
    }
    static leftHuge() {
        // 32
        return styles.marginLeftHuge;
    }
    static leftGreat() {
        // 48
        return styles.leftGreat;
    }
    static leftMajor() {
        // 64
        return styles.leftMajor;
    }

    // Horizontal
    static horizontalTinyOffset() {
        // 8
        return styles.marginHorizontalTinyOffset;
    }
    static horizontalSmallOffset() {
        // 8
        return styles.marginHorizontalSmallOffset;
    }
    static horizontalOffset() {
        // 16
        return styles.marginHorizontalOffset;
    }
    static horizontalNegativeOffset() {
        // -16
        return styles.marginHorizontalNegativeOffset;
    }
    static horizontalMediumOffset() {
        // 24
        return styles.marginHorizontalMediumOffset;
    }

    // Common
    static default() {
        // 16
        return styles.marginDefault;
    }
    static bottomLeftRight() {
        return styles.marginLeftRight;
    }

    static none() {
        // 0
        return styles.none;
    }
}
