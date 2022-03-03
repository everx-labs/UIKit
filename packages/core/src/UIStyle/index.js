import { Platform, StyleSheet } from 'react-native';

import UIColor from '../UIColor';
import UIConstant from '../UIConstant';
import UIDevice from '../UIDevice';
import UIStyleMargin, { marginStyles } from './UIStyleMargin';
import UIStylePadding, { paddingStyles } from './UIStylePadding';
import UIStyleCommon, { commonStyles } from './UIStyleCommon';
import UIStyleFlex, { flexStyles } from './UIStyleFlex';
import UIStyleColor from './UIStyleColor';
import UIStyleContainer, { containerStyles } from './UIStyleContainer';

const UIStyle = StyleSheet.create({
    ...commonStyles,
    ...containerStyles,
    ...flexStyles,
    ...marginStyles,
    ...paddingStyles,

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
    reactNavigationHeader: {
        backgroundColor: UIColor.backgroundPrimary(),
        borderWidth: 0,
        height: UIDevice.navigationBarHeight(),
        borderBottomColor: 'transparent',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        elevation: Platform.select({
            android: 0,
        }),
    },
    navigatorButton: {
        marginHorizontal: UIConstant.normalContentOffset(),
        height: 32,
        width: 32,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },

    // split view controller
    splitViewController: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        maxWidth: UIConstant.elasticWidthMax(),
        alignSelf: 'center',
        borderRadius: UIConstant.smallBorderRadius(),
        padding: UIConstant.contentOffset(),
    },
    masterViewController: {
        minWidth: UIConstant.masterScreenWidth(),
        maxWidth: UIConstant.masterScreenWidth(),
        overflow: 'hidden',
        borderRadius: UIConstant.smallBorderRadius(),
    },
    detailViewController: {
        flex: 1,
        marginLeft: UIConstant.contentOffset(),
        borderRadius: UIConstant.smallBorderRadius(),
        overflow: 'hidden',
    },
});

UIStyle.color = UIStyleColor;
UIStyle.common = UIStyleCommon;
UIStyle.container = UIStyleContainer;
UIStyle.margin = UIStyleMargin;
UIStyle.padding = UIStylePadding;
UIStyle.flex = UIStyleFlex;

// Deprecated
UIStyle.displayFlex = UIStyleFlex;

// Deprecated
UIStyle.Color = UIStyleColor;
UIStyle.Common = UIStyleCommon;
UIStyle.Container = UIStyleContainer;
UIStyle.Margin = UIStyleMargin;
UIStyle.Padding = UIStylePadding;
UIStyle.Flex = UIStyleFlex;

export default UIStyle;
