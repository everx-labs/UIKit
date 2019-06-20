import { StyleSheet } from 'react-native';

import UIStyle from '../UIStyle';
import UIConstant from '../UIConstant';

const styles = StyleSheet.create({
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
});

export default class UIStyleMargin {
    // Top
    static topTiny() { // 4
        return UIStyle.marginTopTiny;
    }
    static topSmall() { // 8
        return UIStyle.marginTopSmall;
    }
    static topNormal() { // 12
        return UIStyle.marginTopNormal;
    }
    static topDefault() { // 16
        return UIStyle.marginTopDefault;
    }
    static topMedium() { // 24
        return UIStyle.marginTopMedium;
    }
    static topHuge() { // 32
        return UIStyle.marginTopHuge;
    }
    static topSpacious() { // 40
        return UIStyle.marginTopSpacious;
    }
    static topGreat() { // 48
        return UIStyle.marginTopGreat;
    }
    static topMajor() { // 64
        return UIStyle.marginTopMajor;
    }
    static topMassive() { // 72
        return UIStyle.marginTopMassive;
    }
    static topVast() { // 80
        return UIStyle.marginTopVast;
    }
    static topTremendous() { // 96
        return UIStyle.marginTopTremendous;
    }
    static topEnormous() { // 104
        return UIStyle.marginTopEnormous;
    }

    // Bottom
    static bottomTiny() { // 4
        return UIStyle.marginBottomTiny;
    }
    static bottomSmall() { // 8
        return UIStyle.marginBottomSmall;
    }
    static bottomNormal() { // 12
        return UIStyle.marginBottomNormal;
    }
    static bottomDefault() { // 16
        return UIStyle.marginBottomDefault;
    }
    static bottomMedium() { // 24
        return UIStyle.marginBottomMedium;
    }
    static bottomHuge() { // 32
        return UIStyle.marginBottomHuge;
    }
    static bottomMajor() { // 64
        return UIStyle.marginBottomMajor;
    }
    static bottomVast() { // 80
        return UIStyle.marginBottomVast;
    }

    // Right
    static rightTiny() { // 4
        return UIStyle.marginRightTiny;
    }
    static rightSmall() { // 8
        return UIStyle.marginRightSmall;
    }
    static rightNormal() { // 12
        return UIStyle.marginRightNormal;
    }
    static rightDefault() { // 16
        return UIStyle.marginRightDefault;
    }
    static rightMedium() { // 24
        return UIStyle.marginRightMedium;
    }
    static rightHuge() { // 32
        return UIStyle.marginRightHuge;
    }
    static rightGreat() { // 48
        return styles.rightGreat;
    }
    static rightMajor() { // 64
        return styles.rightMajor;
    }

    // Left
    static leftTiny() { // 4
        return UIStyle.marginLeftTiny;
    }
    static leftSmall() { // 8
        return UIStyle.marginLeftSmall;
    }
    static leftNormal() { // 12
        return UIStyle.marginLeftNormal;
    }
    static leftDefault() { // 16
        return UIStyle.marginLeftDefault;
    }
    static leftMedium() { // 24
        return UIStyle.marginLeftMedium;
    }
    static leftGreat() { // 48
        return styles.leftGreat;
    }
    static leftMajor() { // 64
        return styles.leftMajor;
    }

    // Horizontal
    static horizontalSmallOffset() { // 8
        return UIStyle.marginHorizontalSmallOffset;
    }
    static horizontalOffset() { // 16
        return UIStyle.marginHorizontalOffset;
    }
    static horizontalNegativeOffset() { // -16
        return UIStyle.marginHorizontalNegativeOffset;
    }
    static horizontalMediumOffset() { // 24
        return UIStyle.marginHorizontalMediumOffset;
    }

    // Common
    static default() { // 16
        return UIStyle.marginDefault;
    }
}
