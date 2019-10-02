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
    UIGrid,
    UILink,
    UIActionIcon,
    UIButton,
    UIButtonGroup,
    UIStyle,
    UICustomSheet,
    UIDetailsToggle,
    UIDetailsCheckbox,
    UIDetailsRadio,
    UICard,
    UIUnfold,
    UIDetailsInput,
    UIDateInput,
    UIQuote,
} from '../../../UIKit';

class Hidden extends React.Component {
    render() {
        return (<View style={{ display: 'none' }}>{this.props.children}</View>);
    }
}

const TableComponent = ({ propDefinitions }) => {
    let props = propDefinitions.filter(({
        property, propType, required, description,
    }) => {
        return (description && description.indexOf('@ignore') === -1);
    });
    props = props.map(({
        property, propType, required, description, defaultValue,
    }) => {
        const prop = {};
        prop.name = property;

        let lines = description.split('\n');
        const defaultValueLine = lines.find(line => line.indexOf('@default') >= 0);
        lines = lines.filter(line => line.indexOf('@default') === -1);

        prop.description = lines.join('\n');
        prop.flowType = propType;
        prop.defaultValue = { value: defaultValue };

        if (!prop.defaultValue.value && defaultValueLine) {
            const words = defaultValueLine.split(' ');
            const defaultIdx = words.indexOf('@default');
            if (defaultIdx >= 0) {
                prop.defaultValue.value = words[defaultIdx + 1] || '';
            }
        }
        return prop;
    });

    return (
        <PropsSection props={props} />
    );
};

if (Platform.OS === 'web') {
    storiesOf(Constants.CategoryProperties, module)
        .addDecorator(withInfo)
        .addDecorator(getStory => <Hidden>{getStory()}</Hidden>)
        .addParameters({
            info: {
                TableComponent,
                propTablesExclude: [CenterView, View, React.Fragment, withInfo],
                source: false,
                inline: true,
            },
        })
        .add('Button', () => <UIButton />, { info: { propTables: [UIButton] } })
        .add('ButtonGroup', () => <UIButtonGroup />, { info: { propTables: [UIButtonGroup] } })
        .add('ButtonIcon', () => <UIActionIcon />, { info: { propTables: [UIActionIcon] } })
        .add('Card', () => <UICard />, { info: { propTables: [UICard] } })
        .add('Checkbox', () => <UIDetailsCheckbox />, { info: { propTables: [UIDetailsCheckbox] } })
        .add('DateInput', () => <UIDateInput />, { info: { propTables: [UIDateInput] } })
        .add('DetailsInput', () => <UIDetailsInput />, { info: { propTables: [UIDetailsInput] } })
        .add('Grid', () => <UIGrid />, { info: { propTables: [UIGrid] } })
        .add('Link', () => <UILink />, { info: { propTables: [UILink] } })
        .add('UIQuote', () => <UIQuote />, { info: { propTables: [UIQuote] } })
        .add('Radio', () => <UIDetailsRadio />, { info: { propTables: [UIDetailsRadio] } })
        .add('Toggle', () => <UIDetailsToggle />, { info: { propTables: [UIDetailsToggle] } })
        .add('Unfold', () => <UIUnfold />, { info: { propTables: [UIUnfold] } });
}
