import React from 'react';
import { View, Text } from 'react-native';
import CenterView from '../CenterView';
import FullWidthView from '../FullWidthView';

import { storiesOf } from '../helpers/storiesOf';
import Constants from '../helpers/constants';
import { getUri } from '../helpers/getUri';

import {
    UIStyle,
    UIColor,
    UICard,
    UIComponent,
    UIButtonGroup,
    UIUnfold,
} from '../../../UIKit';


const icoActiveDefault = getUri(require('../../../assets/ico-toggle-active/ico-toggle-active.png'));
const iconDefault = getUri(require('../../../assets/ico-triangle/ico-triangle.png'));
const iconShowDefault = getUri(require('../../../assets/ico-unfold/ico-show.png'));
const iconHideDefault = getUri(require('../../../assets/ico-unfold/ico-hide.png'));

class UnfoldTester extends UIComponent {
    constructor() {
        super();
        this.state = {
            unfolded: [false, true],
        };
    }

    onPress(unfolded, idx) {
        const unfoldeds = this.state.unfolded;
        for (let i = 0; i < unfoldeds.length; ++i) {
            unfoldeds[i] = i === idx ? unfolded : !unfolded;
        }
        this.setState({ unfolded: unfoldeds });
    }

    render() {
        return (
            <View>
                <UIUnfold
                    content={
                        <Text style={UIStyle.Text.secondaryBodyMedium()}>
                            {'1111111111'}
                        </Text>
                    }
                    titleShow="Show"
                    titleHide="Hide"
                    showButton={false}
                    unfolded={this.state.unfolded[0]}
                    onPress={(unfolded) => { this.onPress(unfolded, 0); }}
                />
                <UIUnfold
                    content={
                        <Text style={UIStyle.Text.secondaryBodyMedium()}>
                            {'222222222'}
                        </Text>
                    }
                    titleShow="Show"
                    titleHide="Hide"
                    showButton={false}
                    unfolded={this.state.unfolded[1]}
                    onPress={(unfolded) => { this.onPress(unfolded, 1); }}
                />
            </View>
        );
    }
}

storiesOf(Constants.CategoryNavigationUnfold, module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('Unfold text only', () => (
        <UIUnfold
            content={
                <View>
                    <UICard
                        labelIcon={icoActiveDefault}
                        label="+333 Grams"
                        caption="Today"
                        size={UICard.Size.XS}
                    />
                    <UICard
                        labelIcon={icoActiveDefault}
                        label="+333 Grams"
                        caption="Today"
                        size={UICard.Size.XS}
                    />
                </View>
            }
            titleHide="Hide"
            titleShow="Show all"
            showButton={false}
        />
    ))
    .add('Unfold text && button', () => (
        <UIUnfold
            content={
                <Text style={UIStyle.Text.secondaryBodyMedium()}>
                    wWLkflndlk lkdjrgflkd lfkjdkfdlkdfv
                    dfl;g;d;sd
                    ipsum lorum etc
                </Text>
            }
            titleHide="Hide"
            titleShow="Show all"
            iconShow={iconShowDefault}
            iconHide={iconHideDefault}
        />
    ))
    .add('Unfold text && button left', () => (
        <UIUnfold
            content={
                <Text style={UIStyle.Text.secondaryBodyMedium()}>
                    wWLkflndlk lkdjrgflkd lfkjdkfdlkdfv
                    dfl;g;d;sd
                    ipsum lorum etc
                </Text>
            }
            titleHide="Hide"
            titleShow="Show all"
            iconShow={iconShowDefault}
            iconHide={iconHideDefault}
            iconPosition={UIUnfold.Position.Left}
        />
    ))
    .add('Unfold button only right', () => (
        <UIUnfold
            content={
                <Text style={UIStyle.Text.secondaryBodyMedium()}>
                    wWLkflndlk lkdjrgflkd lfkjdkfdlkdfv
                    dfl;g;d;sd
                    ipsum lorum etc
                </Text>
            }
            iconShow={iconShowDefault}
            iconHide={iconHideDefault}
        />
    ))
    .add('Unfold button only left', () => (
        <UIUnfold
            content={
                <Text style={UIStyle.Text.secondaryBodyMedium()}>
                    wWLkflndlk lkdjrgflkd lfkjdkfdlkdfv
                    dfl;g;d;sd
                    ipsum lorum etc
                </Text>
            }
            iconShow={iconShowDefault}
            iconHide={iconHideDefault}
            iconPosition={UIUnfold.Position.Left}
        />
    ))
    .add('Unfolded', () => (
        <UIUnfold
            content={
                <Text style={UIStyle.Text.secondaryBodyMedium()}>
                    wWLkflndlk lkdjrgflkd lfkjdkfdlkdfv
                    dfl;g;d;sd
                    ipsum lorum etc
                </Text>
            }
            iconShow={iconShowDefault}
            iconHide={iconHideDefault}
            unfolded
        />
    ))
    .add('UnfoldTester', () => (
        <UnfoldTester />
    ));
