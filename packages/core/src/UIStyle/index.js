import { StyleSheet } from 'react-native';

import UIConstant from '../UIConstant';
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

export default UIStyle;
