import { Platform, StyleSheet } from 'react-native';

import UIColor from '../UIColor';
import UIFont from '../UIFont';
import UIConstant from '../UIConstant';
import UIDevice from '../UIDevice';
import UIStyleBorder, { borderStyles } from './UIStyleBorder';
import UIStyleHeight, { heightStyles } from './UIStyleHeight';
import UIStyleMargin, { marginStyles } from './UIStyleMargin';
import UIStylePadding, { paddingStyles } from './UIStylePadding';
import UIStyleCommon, { commonStyles } from './UIStyleCommon';
import UIStyleFlex from './UIStyleFlex';
import UIStyleText from '../UITextStyle/UIStyleText';
import UIStyleWidth, { widthStyles } from './UIStyleWidth';
import UIStyleColor from './UIStyleColor';
import UIStyleContainer from './UIStyleContainer';

const UIStyle = StyleSheet.create({
    ...commonStyles,
    ...widthStyles,
    ...heightStyles,
    ...marginStyles,
    ...paddingStyles,
    ...borderStyles,

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

    // split view controller
    splitViewController: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        maxWidth: UIConstant.elasticWidthMax(),
        height: '100%',
        alignSelf: 'center',
        borderRadius: UIConstant.smallBorderRadius(),
        padding: UIConstant.contentOffset(),
    },
    masterViewController: {
        flex: 1,
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

UIStyle.border = UIStyleBorder;
UIStyle.color = UIStyleColor;
UIStyle.common = UIStyleCommon;
UIStyle.container = UIStyleContainer;
UIStyle.height = UIStyleHeight;
UIStyle.margin = UIStyleMargin;
UIStyle.padding = UIStylePadding;
UIStyle.text = UIStyleText;
UIStyle.width = UIStyleWidth;
UIStyle.flex = UIStyleFlex;

// flex already exists in UIStyle
UIStyle.displayFlex = UIStyleFlex;

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
UIStyle.Flex = UIStyleFlex;

export default UIStyle;
