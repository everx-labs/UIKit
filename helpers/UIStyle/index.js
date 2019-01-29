import { Platform, StyleSheet } from 'react-native';

import UIColor from '../UIColor';
import UIFont from '../UIFont';
import UIConstant from '../UIConstant';
import UIDevice from '../UIDevice';

const text = {
    ...UIConstant.disabledOutline(),
    backgroundColor: 'transparent',
    textAlign: 'left',
};

const textPrimary = {
    ...text,
    color: UIColor.textPrimary(),
};

const textCaution = {
    ...text,
    color: UIColor.textCaution(),
};

const textSecondary = {
    ...text,
    color: UIColor.textSecondary(),
};

const textError = {
    ...text,
    color: UIColor.error(),
};

const textSuccess = {
    ...text,
    color: UIColor.success(),
};

const textTertiary = {
    ...text,
    color: UIColor.textTertiary(),
};

const textWhite = {
    ...text,
    color: UIColor.white(),
};

const textAction = {
    ...text,
    color: UIColor.primary(),
};

const absoluteFillObject = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
};

const borderTop = {
    borderTopColor: UIColor.light(),
    borderTopWidth: 1,
};

const borderBottom = {
    borderBottomColor: UIColor.light(),
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
    flex: {
        flex: 1,
    },

    // [Text Primary]
    // Title
    textPrimaryTitleLight: {
        ...textPrimary,
        ...UIFont.titleLight(),
    },
    // Subtitle
    textPrimarySubtitleLight: {
        ...textPrimary,
        ...UIFont.subtitleLight(),
    },
    textPrimarySubtitleRegular: {
        ...textPrimary,
        ...UIFont.subtitleRegular(),
    },
    textPrimarySubtitleBold: {
        ...textPrimary,
        ...UIFont.subtitleBold(),
    },
    // Accent
    textPrimaryAccentRegular: {
        ...textPrimary,
        ...UIFont.accentRegular(),
    },
    textPrimaryAccentBold: {
        ...textPrimary,
        ...UIFont.accentBold(),
    },
    // Body
    textPrimaryBodyRegular: {
        ...textPrimary,
        ...UIFont.bodyRegular(),
    },
    textPrimaryBodyMedium: {
        ...textPrimary,
        ...UIFont.bodyMedium(),
    },
    textPrimaryBodyBold: {
        ...textPrimary,
        ...UIFont.bodyBold(),
    },
    // Small
    textPrimarySmallMedium: {
        ...textPrimary,
        ...UIFont.smallMedium(),
    },
    textPrimarySmallRegular: {
        ...textPrimary,
        ...UIFont.smallRegular(),
    },
    textPrimarySmallBold: {
        ...textPrimary,
        ...UIFont.smallBold(),
    },
    // Caption
    textPrimaryCaptionRegular: {
        ...textPrimary,
        ...UIFont.captionRegular(),
    },
    textPrimaryCaptionMedium: {
        ...textPrimary,
        ...UIFont.captionMedium(),
    },
    // Tiny
    textPrimaryTinyRegular: {
        ...textPrimary,
        ...UIFont.tinyRegular(),
    },
    textPrimaryTinyMedium: {
        ...textPrimary,
        ...UIFont.tinyMedium(),
    },

    // [Text Secondary]
    // Accent
    textSecondaryAccentRegular: {
        ...textSecondary,
        ...UIFont.accentRegular(),
    },
    // Body
    textSecondaryBodyRegular: {
        ...textSecondary,
        ...UIFont.bodyRegular(),
    },
    textSecondaryBodyMedium: {
        ...textSecondary,
        ...UIFont.bodyMedium(),
    },
    textSecondaryBodyBold: {
        ...textSecondary,
        ...UIFont.bodyBold(),
    },
    // Small
    textSecondarySmallRegular: {
        ...textSecondary,
        ...UIFont.smallRegular(),
    },
    textSecondarySmallMedium: {
        ...textSecondary,
        ...UIFont.smallRegular(),
    },
    // Caption
    textSecondaryCaptionRegular: {
        ...textSecondary,
        ...UIFont.captionRegular(),
    },
    textSecondaryCaptionMedium: {
        ...textSecondary,
        ...UIFont.captionMedium(),
    },
    // Tiny
    textSecondaryTinyRegular: {
        ...textSecondary,
        ...UIFont.tinyRegular(),
    },
    textSecondaryTinyMedium: {
        ...textSecondary,
        ...UIFont.tinyMedium(),
    },

    // [Text Caution]
    textCautionCaptionRegular: {
        ...textCaution,
        ...UIFont.captionRegular(),
    },

    // [Text success]
    textSuccessCaptionRegular: {
        ...textSuccess,
        ...UIFont.captionRegular(),
    },

    // [Text tertiary]
    textTertiaryTinyRegular: {
        ...textTertiary,
        ...UIFont.tinyRegular(),
    },
    textTertiaryTinyMedium: {
        ...textTertiary,
        ...UIFont.tinyMedium(),
    },
    textTertiaryTinyBold: {
        ...textTertiary,
        ...UIFont.tinyBold(),
    },

    // [Text white]
    textWhiteTinyRegular: {
        ...textWhite,
        ...UIFont.tinyRegular(),
    },

    // [Text Action]
    textActionSmallMedium: {
        ...textAction,
        ...UIFont.smallMedium(),
    },

    // [Text Error]
    textErrorCaptionMedium: {
        ...textError,
        ...UIFont.captionMedium(),
    },

    // offsets
    marginTopTiny: {
        marginTop: UIConstant.tinyContentOffset(),
    },
    marginTopSmall: {
        marginTop: UIConstant.smallContentOffset(),
    },
    marginTopNormal: {
        marginTop: UIConstant.normalContentOffset(),
    },
    marginTopDefault: {
        marginTop: UIConstant.contentOffset(),
    },
    marginTopMedium: {
        marginTop: UIConstant.mediumContentOffset(),
    },
    marginTopHuge: {
        marginTop: UIConstant.hugeContentOffset(),
    },

    marginBottomTiny: {
        marginBottom: UIConstant.tinyContentOffset(),
    },
    marginBottomSmall: {
        marginBottom: UIConstant.smallContentOffset(),
    },
    marginBottomNormal: {
        marginBottom: UIConstant.normalContentOffset(),
    },
    marginBottomDefault: {
        marginBottom: UIConstant.contentOffset(),
    },
    marginBottomMedium: {
        marginBottom: UIConstant.mediumContentOffset(),
    },

    marginRightDefault: {
        marginRight: UIConstant.contentOffset(),
    },
    marginRightSmall: {
        marginRight: UIConstant.smallContentOffset(),
    },
    marginRightTiny: {
        marginRight: UIConstant.tinyContentOffset(),
    },

    marginLeftDefault: {
        marginLeft: UIConstant.contentOffset(),
    },
    marginLeftTiny: {
        marginLeft: UIConstant.tinyContentOffset(),
    },

    marginHorizontalOffset: {
        marginLeft: UIConstant.contentOffset(),
        marginRight: UIConstant.contentOffset(),
    },
    marginHorizontalMediumOffset: {
        marginLeft: UIConstant.mediumContentOffset(),
        marginRight: UIConstant.mediumContentOffset(),
    },
    marginHorizontalSmallOffset: {
        marginLeft: UIConstant.smallContentOffset(),
        marginRight: UIConstant.smallContentOffset(),
    },

    // borders
    border: {
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

    // colors
    backgroundPrimaryColor: {
        backgroundColor: UIColor.backgroundPrimary(),
    },
    backgroundLightColor: {
        backgroundColor: UIColor.light(),
    },

    // containers
    absoluteFillObject: {
        ...absoluteFillObject,
    },
    screenBackground: {
        ...absoluteFillObject,
        backgroundColor: UIColor.backgroundPrimary(),
    },
    screenContainer: {
        flex: 1,
        flexDirection: 'column',
        // alignItems: 'center',
    },
    pageContainer: {
        // flex: 1,
        paddingHorizontal: UIConstant.contentOffset(),
        width: '100%',
        maxWidth: UIConstant.elasticWidthMax(),
        alignSelf: 'center',
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
    bottomScreenContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    topScreenContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
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

    // TON-Scan
    fullScreenCenterContainer: {
        width: '100%',
        alignItems: 'center',
    },
    halfWidthContainer: {
        width: '50%',
        paddingHorizontal: UIConstant.contentOffset(),
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
        maxWidth: UIConstant.elasticWidthRegular(),
        overflow: 'hidden',
    },
    detailViewController: {
        flex: 1,
        ...borderLeft,
        overflow: 'hidden',
    },
});

export default UIStyle;
