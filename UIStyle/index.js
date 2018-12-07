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

const textSecondary = {
    ...text,
    color: UIColor.textSecondary(),
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

    // Text Primary
    textPrimaryBodyRegular: {
        ...textPrimary,
        ...UIFont.bodyRegular(),
    },
    textPrimaryBodyBold: {
        ...textPrimary,
        ...UIFont.bodyBold(),
    },
    textPrimaryTinyRegular: {
        ...textPrimary,
        ...UIFont.tinyRegular(),
    },
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
    textPrimarySubtitleLight: {
        ...textPrimary,
        ...UIFont.subtitleLight(),
    },
    textPrimarySubtitleRegular: {
        ...textPrimary,
        ...UIFont.subtitleRegular(),
    },
    textPrimaryAccentRegular: {
        ...textPrimary,
        ...UIFont.accentRegular(),
    },
    textPrimaryTitleLight: {
        ...textPrimary,
        ...UIFont.titleLight(),
    },

    // Text Secondary
    textSecondaryBodyRegular: {
        ...textSecondary,
        ...UIFont.bodyRegular(),
    },
    textSecondaryAccentRegular: {
        ...textSecondary,
        ...UIFont.accentRegular(),
    },
    textSecondarySmallRegular: {
        ...textSecondary,
        ...UIFont.smallRegular(),
    },
    textSecondarySmallMedium: {
        ...textSecondary,
        ...UIFont.smallRegular(),
    },
    textSecondaryCaptionRegular: {
        ...textSecondary,
        ...UIFont.captionRegular(),
    },
    textSecondaryCaptionMedium: {
        ...textSecondary,
        ...UIFont.captionMedium(),
    },
    textSecondaryTinyRegular: {
        ...textSecondary,
        ...UIFont.tinyRegular(),
    },
    textSecondaryTinyMedium: {
        ...textSecondary,
        ...UIFont.tinyMedium(),
    },

    // Text tertiary
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

    // Text white
    textWhiteTinyRegular: {
        ...textWhite,
        ...UIFont.tinyRegular(),
    },

    // Text Action
    textActionSmallMedium: {
        ...textAction,
        ...UIFont.smallMedium(),
    },

    // offsets
    marginTopTiny: {
        marginTop: UIConstant.tinyContentOffset(),
    },
    marginTopSmall: {
        marginTop: UIConstant.smallContentOffset(),
    },
    marginTopDefault: {
        marginTop: UIConstant.contentOffset(),
    },
    marginTopMedium: {
        marginTop: UIConstant.mediumContentOffset(),
    },

    marginBottomTiny: {
        marginBottom: UIConstant.tinyContentOffset(),
    },
    marginBottomSmall: {
        marginBottom: UIConstant.smallContentOffset(),
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
