import React from 'react';
import { View, Platform } from 'react-native';

import CenterView from '../CenterView';
import PropsSection from '../PropsRenderer';

import { storiesOf } from '../helpers/storiesOf';
import { withInfo } from '../helpers/addonInfo';
import { getMarkdown } from '../helpers/getMarkdown';
import { getUri } from '../helpers/getUri';
import Constants from '../helpers/constants';

import {
    UIButton,
    UIButtonGroup,
    UIStyle,
    UICustomSheet,
    UIDetailsToggle,
    UIDetailsCheckbox,
} from '../../../UIKit';

class Hidden extends React.Component {
    render() {
        return (<View style={{ display: 'none' }}>{this.props.children}</View>);
    }
}

if (Platform.OS === 'web') {
    storiesOf(Constants.CategoryProperties, module)
        .addDecorator(withInfo)
        .addDecorator(getStory => <Hidden>{getStory()}</Hidden>)
        .addParameters({
            info: {
                propTablesExclude: [CenterView, View, React.Fragment, withInfo],
                source: false,
                inline: true,
            },
        })
        .add('Button', () => <UIButton />, { info: { propTables: [UIButton] } })
        .add('ButtonGroup', () => <UIButtonGroup />, { info: { propTables: [UIButtonGroup] } })
        .add('Toggle', () => <UIDetailsToggle />, { info: { propTables: [UIDetailsToggle] } })
        .add('Checkbox', () => <UIDetailsCheckbox />, { info: { propTables: [UIDetailsCheckbox] } });
}
