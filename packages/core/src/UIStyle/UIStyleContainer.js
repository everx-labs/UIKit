// @flow
import { StyleSheet } from 'react-native';
import UIConstant from '../UIConstant';
import UIColor from '../UIColor';

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

export const containerStyles = {
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
    absoluteFillContainer: {
        ...absoluteFillContainer,
    },
    absoluteFillObject: {
        // has { overflow: hidden }
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
    thirdWidthContainer: {
        width: '33%',
        maxWidth: UIConstant.elasticWidthHuge() / 3,
        alignSelf: 'center',
    },
    twoThirdsWidthContainer: {
        width: '66%',
        maxWidth: (UIConstant.elasticWidthHuge() / 3) * 2,
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
};

const styles = StyleSheet.create(containerStyles);

export default class UIStyleContainer {
    static absoluteFill() {
        return styles.absoluteFillContainer;
    }

    static fullWidthPadding() {
        return styles.fullWidthPaddingContainer;
    }

    static fullWidthPaddingCenter() {
        return styles.fullWidthPaddingCenterContainer;
    }

    static screen() {
        return styles.screenContainer;
    }

    static page() {
        return styles.pageContainer;
    }

    static pageNormal() {
        return styles.pageNormalContainer;
    }

    static pageSlim() {
        return styles.pageSlimContainer;
    }

    static bottomScreen() {
        return styles.bottomScreenContainer;
    }

    static bottomOffsetScreen() {
        return styles.bottomOffsetScreenContainer;
    }

    static bottomOffsetItemContainer() {
        return styles.bottomOffsetItemContainer;
    }

    static leftScreen() {
        return styles.leftScreenContainer;
    }

    static rightScreen() {
        return styles.rightScreenContainer;
    }

    static center() {
        return styles.centerContainer;
    }

    static centerLeft() {
        return styles.centerLeftContainer;
    }

    static centerRight() {
        return styles.centerRightContainer;
    }

    static rowSpace() {
        return styles.rowSpaceContainer;
    }

    static rowCenterSpace() {
        return styles.rowCenterSpaceContainer;
    }

    static absoluteFillWidth() {
        return styles.absoluteFillWidthContainer;
    }

    static topScreen() {
        return styles.topScreenContainer;
    }

    static screenBackground() {
        return styles.screenBackground;
    }

    static halfWidth() {
        return containerStyles.halfWidthContainer;
    }

    static thirdWidth() {
        return containerStyles.thirdWidthContainer;
    }
}
