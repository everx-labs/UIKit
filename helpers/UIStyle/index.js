import { Platform, StyleSheet } from 'react-native';

import UIColor from '../UIColor';
import UIFont from '../UIFont';
import UIConstant from '../UIConstant';
import UIDevice from '../UIDevice';
import UIStyleBorder from './UIStyleBorder';
import UIStyleHeight from './UIStyleHeight';
import UIStyleMargin from './UIStyleMargin';
import UIStylePadding from './UIStylePadding';
import UIStyleCommon from './UIStyleCommon';
import UIStyleFlex from './UIStyleFlex';
import UIStyleText from '../UITextStyle/UIStyleText';
import UIStyleWidth from './UIStyleWidth';
import UIStyleColor from './UIStyleColor';
import UIStyleContainer from './UIStyleContainer';

const absoluteFillWidthContainer = {
    position: 'absolute',
    left: 0,
    right: 0,
};

const absoluteFillHeightContainer = {
    position: 'absolute',
    top: 0,
    bottom: 0,
};

const absoluteFillContainer = {
    ...absoluteFillWidthContainer,
    top: 0,
    bottom: 0,
};

const absoluteFillObject = {
    ...absoluteFillContainer,
    overflow: 'hidden',
};

const pageContainer = {
    paddingHorizontal: UIConstant.contentOffset(),
    width: '100%',
    alignSelf: 'center',
};

const borderTop = {
    borderTopColor: UIColor.light(),
    borderTopWidth: 1,
};

const borderBottom = {
    borderBottomColor: UIColor.light(),
    borderBottomWidth: 1,
};

const cellBorderBottom = {
    borderBottomColor: UIColor.whiteLight(),
    borderBottomWidth: 1,
};

const cellBorderTop = {
    borderTopColor: UIColor.whiteLight(),
    borderTopWidth: 1,
};

const borderBottomAction = {
    borderBottomColor: UIColor.primary(),
    borderBottomWidth: 1,
};

const borderLeft = {
    borderLeftColor: UIColor.light(),
    borderLeftWidth: 1,
};

const borderRight = {
    borderRightColor: UIColor.light(),
    borderRightWidth: 1,
};

const profilePhotoSize = 72;

const UIStyle = StyleSheet.create({
    // Deprecated in order to use flex as subclass in future
    flex: {
        flex: 1,
    },
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
    centerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    centerRightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    rowSpaceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rowCenterSpaceContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    overflowHidden: {
        overflow: 'hidden',
    },

    commonShadow: {
        ...UIConstant.commonShadow(),
    },
    shadow40: {
        ...UIConstant.shadow40(),
    },
    cardShadow: {
        ...UIConstant.cardShadow(),
    },

    fullHeight: {
        height: '100%',
    },

    fullWidth: {
        width: '100%',
    },
    threeQuartersWidth: {
        width: '75%',
    },
    twoThirdsWidth: {
        width: '66%',
    },
    halfWidth: {
        width: '50%',
    },
    thirdWidth: {
        width: '33%',
    },
    quarterWidth: {
        width: '25%',
    },

    positionAbsolute: {
        position: 'absolute',
    },

    // offsets
    marginTopTiny: { // 4
        marginTop: UIConstant.tinyContentOffset(),
    },
    marginTopSmall: { // 8
        marginTop: UIConstant.smallContentOffset(),
    },
    marginTopNormal: { // 12
        marginTop: UIConstant.normalContentOffset(),
    },
    marginTopDefault: { // 16
        marginTop: UIConstant.contentOffset(),
    },
    marginTopMedium: { // 24
        marginTop: UIConstant.mediumContentOffset(),
    },
    marginTopHuge: { // 32
        marginTop: UIConstant.hugeContentOffset(),
    },
    marginTopSpacious: { // 40
        marginTop: UIConstant.spaciousContentOffset(),
    },
    marginTopGreat: { // 48
        marginTop: UIConstant.greatContentOffset(),
    },
    marginTopBig: { // 56
        marginTop: UIConstant.bigCellHeight(),
    },
    marginTopMajor: { // 64
        marginTop: UIConstant.majorContentOffset(),
    },
    marginTopMassive: { // 72
        marginTop: UIConstant.massiveContentOffset(),
    },
    marginTopVast: { // 80
        marginTop: UIConstant.vastContentOffset(),
    },
    marginTopTremendous: { // 96
        marginTop: UIConstant.tremendousContentOffset(),
    },
    marginTopEnormous: { // 104
        marginTop: UIConstant.enormousContentOffset(),
    },

    marginBottomTiny: { // 4
        marginBottom: UIConstant.tinyContentOffset(),
    },
    marginBottomSmall: { // 8
        marginBottom: UIConstant.smallContentOffset(),
    },
    marginBottomNormal: { // 12
        marginBottom: UIConstant.normalContentOffset(),
    },
    marginBottomDefault: { // 16
        marginBottom: UIConstant.contentOffset(),
    },
    marginBottomMedium: { // 24
        marginBottom: UIConstant.mediumContentOffset(),
    },
    marginBottomHuge: { // 32
        marginBottom: UIConstant.hugeContentOffset(),
    },
    marginBottomMajor: { // 64
        marginBottom: UIConstant.majorContentOffset(),
    },
    marginBottomMassive: { // 72
        marginBottom: UIConstant.massiveContentOffset(),
    },
    marginBottomVast: { // 80
        marginBottom: UIConstant.vastContentOffset(),
    },

    marginRightTiny: { // 4
        marginRight: UIConstant.tinyContentOffset(),
    },
    marginRightSmall: { // 8
        marginRight: UIConstant.smallContentOffset(),
    },
    marginRightNormal: { // 12
        marginRight: UIConstant.normalContentOffset(),
    },
    marginRightDefault: { // 16
        marginRight: UIConstant.contentOffset(),
    },
    marginRightMedium: { // 24
        marginRight: UIConstant.mediumContentOffset(),
    },
    marginRightHuge: { // 32
        marginRight: UIConstant.hugeContentOffset(),
    },

    marginLeftTiny: { // 4
        marginLeft: UIConstant.tinyContentOffset(),
    },
    marginLeftSmall: { // 8
        marginLeft: UIConstant.smallContentOffset(),
    },
    marginLeftNormal: { // 12
        marginLeft: UIConstant.normalContentOffset(),
    },
    marginLeftDefault: { // 16
        marginLeft: UIConstant.contentOffset(),
    },
    marginLeftMedium: { // 24
        marginLeft: UIConstant.mediumContentOffset(),
    },
    marginLeftHuge: { // 32
        marginLeft: UIConstant.hugeContentOffset(),
    },

    marginHorizontalOffset: { // 16
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

    marginDefault: { // 16
        margin: UIConstant.contentOffset(),
    },

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

    // borders
    borderAround: {
        ...borderTop,
        ...borderBottom,
        ...borderLeft,
        ...borderRight,
    },
    borderBottom: {
        ...borderBottom,
    },
    borderLeft: {
        ...borderLeft,
    },
    borderTop: {
        ...borderTop,
    },
    borderBottomAction: {
        ...borderBottomAction,
    },
    cellBorderTop: {
        ...cellBorderTop,
    },
    cellBorderBottom: {
        ...cellBorderBottom,
    },
    borderRadiusDefault: {
        borderRadius: UIConstant.borderRadius(),
    },

    // colors
    backgroundPrimaryColor: {
        backgroundColor: UIColor.backgroundPrimary(),
    },
    backgroundLightColor: {
        backgroundColor: UIColor.light(),
    },
    backgroundTransparent: {
        backgroundColor: 'transparent',
    },

    // containers
    absoluteFillContainer: {
        ...absoluteFillContainer,
    },
    absoluteFillObject: { // has { overflow: hidden }
        ...absoluteFillObject,
    },
    screenBackground: {
        ...absoluteFillObject,
        backgroundColor: UIColor.backgroundPrimary(),
    },
    screenContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    pageContainer: {
        ...pageContainer,
        maxWidth: UIConstant.elasticWidthMax(),
    },
    pageNormalContainer: {
        ...pageContainer,
        maxWidth: UIConstant.elasticWidthNormal(),
    },
    pageSlimContainer: {
        ...pageContainer,
        maxWidth: UIConstant.elasticWidthHalfNormal(),
    },
    fullScreenController: {
        flex: 1,
        width: '100%',
        maxWidth: UIConstant.elasticWidthMax(),
        height: '100%',
        alignSelf: 'center',
        overflow: 'hidden',
    },
    bottomOffsetScreenContainer: {
        position: 'absolute',
        left: UIConstant.contentOffset(),
        right: UIConstant.contentOffset(),
        bottom: UIConstant.contentOffset(),
    },
    bottomOffsetItemContainer: {
        marginLeft: UIConstant.contentOffset(),
        marginRight: UIConstant.contentOffset(),
        marginBottom: UIConstant.contentOffset(),
    },
    absoluteFillWidthContainer: {
        ...absoluteFillWidthContainer,
    },
    bottomScreenContainer: {
        ...absoluteFillWidthContainer,
        bottom: 0,
    },
    topScreenContainer: {
        ...absoluteFillWidthContainer,
        top: 0,
    },
    leftScreenContainer: {
        ...absoluteFillHeightContainer,
        left: 0,
    },
    rightScreenContainer: {
        ...absoluteFillHeightContainer,
        right: 0,
    },
    centerOnScreenContainer: {
        position: 'absolute',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        top: '33%',
        left: '50%',
        width: 320,
        marginLeft: -160,
    },
    backgroundImageContainer: {
        width: UIConstant.backgroundImageContainerWidth(),
        height: UIConstant.backgroundImageContainerHeight(),
        backgroundColor: UIColor.backgroundQuinary(),
    },

    fullWidthCenterContainer: {
        width: '100%',
        alignItems: 'center',
    },
    halfWidthContainer: {
        width: '50%',
        maxWidth: UIConstant.elasticWidthHuge() / 2,
        alignSelf: 'center',
    },
    twoThirdsWidthContainer: {
        width: '66%',
        maxWidth: UIConstant.elasticWidthHuge() / 3 * 2,
        alignSelf: 'center',
    },
    fullWidthPaddingContainer: {
        width: '100%',
        paddingHorizontal: UIConstant.contentOffset(),
    },
    fullWidthPaddingCenterContainer: {
        width: '100%',
        paddingHorizontal: UIConstant.contentOffset(),
        alignItems: 'center',
    },

    // navigator
    navigatorHeader: {
        backgroundColor: UIColor.backgroundPrimary(),
        overflow: 'hidden',
        borderWidth: 0,
        height: UIDevice.navigationBarHeight(),
        borderBottomColor: 'transparent',
        elevation: Platform.select({
            android: 0,
        }),
    },
    navigatorHeaderTitle: {
        ...UIFont.bodyMedium(),
        textAlign: 'center',
        color: UIColor.textPrimary(),
        alignSelf: 'center',
    },
    navigatorButton: {
        marginHorizontal: UIConstant.normalContentOffset(),
        height: 32,
        width: 32,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },

    dismissStripe: {
        height: 4,
        width: 40,
        backgroundColor: UIColor.light(),
        borderRadius: 2,
    },

    // profile photo
    profilePhoto: {
        backgroundColor: UIColor.backgroundSecondary(),
        width: profilePhotoSize,
        height: profilePhotoSize,
        borderRadius: profilePhotoSize / 2.0,
        overflow: 'hidden',
    },

    // split view controller
    splitViewController: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        maxWidth: UIConstant.elasticWidthMax(),
        height: '100%',
        alignSelf: 'center',
    },
    masterViewController: {
        flex: 1,
        maxWidth: UIConstant.masterScreenWidth(),
        overflow: 'hidden',
    },
    detailViewController: {
        flex: 1,
        ...borderLeft,
        overflow: 'hidden',
    },

    icon: {
        width: UIConstant.iconSize(),
        height: UIConstant.iconSize(),
    },
    noOpacity: {
        opacity: 0,
    },
    fullOpacity: {
        opacity: 1,
    },
    displayNone: {
        display: 'none',
    },
});

UIStyle.border = UIStyleBorder;
UIStyle.color = UIStyleColor;
UIStyle.common = UIStyleCommon;
UIStyle.container = UIStyleContainer;
UIStyle.height = UIStyleHeight;
UIStyle.margin = UIStyleMargin;
UIStyle.padding = UIStylePadding;
UIStyle.text = UIStyleText;
UIStyle.width = UIStyleWidth;

// already exists in UIStyle
// UIStyle.flex = UIStyleFlex;
UIStyle.Flex = UIStyleFlex;

// Deprecated
UIStyle.Border = UIStyleBorder;
UIStyle.Color = UIStyleColor;
UIStyle.Common = UIStyleCommon;
UIStyle.Container = UIStyleContainer;
UIStyle.Height = UIStyleHeight;
UIStyle.Margin = UIStyleMargin;
UIStyle.Padding = UIStylePadding;
UIStyle.Text = UIStyleText;
UIStyle.Width = UIStyleWidth;

export default UIStyle;
