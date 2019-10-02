import React from 'react';
import { View, Text } from 'react-native';
import CenterView from '../CenterView';
import FullWidthView from '../FullWidthView';

import { storiesOf } from '../helpers/storiesOf';
import Constants from '../helpers/constants';
import { getUri } from '../helpers/getUri';

import {
    UIGrid,
    UITransactionView,
    UIBalanceView,
    UIStyle,
    UIColor,
    UIComponent,
    UICard,
    UIButtonGroup,
    UIQuote,
} from '../../../UIKit';


const icoActiveDefault = getUri(require('../../../assets/ico-toggle-active/ico-toggle-active.png'), 24, 24);
const iconDefault = getUri(require('../../../assets/ico-triangle/ico-triangle.png'), 24, 24);

storiesOf(Constants.CategoryView, module)
    .addDecorator(getStory => <CenterView style={UIStyle.Color.getBackgroundColorStyle(UIColor.white())}>{getStory()}</CenterView>)
    .add('UIQuote', () => (
        <UIQuote>
          <Text style={UIStyle.Text.secondaryBodyRegular()}>Quoted text.</Text>
        <UIQuote/>
    ))
    .add('UITransactionView', () => (
        <UITransactionView
            cacheKey="amountTransaction"
            testID="transactionCellView"
            amount="100,0"
            title="Jose Aguilar"
            description="Sender"
            separator=","
            initials="JA"
            onPress={() => {}}
        />
    ))
    .add('UIBalanceView', () => (
        <UIButtonGroup direction={UIButtonGroup.Direction.Column} gutter={8}>
            <UIBalanceView
                cacheKey="totalBalance"
                testID="balanceView"
                description="Total balance"
                containerStyle={UIStyle.Common.flex()}
                balance="100,0"
                separator=","
                tokenSymbol="G"
                loading={false}
            />
            <UIBalanceView
                cacheKey="totalBalance"
                testID="balanceView"
                description="Total balance"
                containerStyle={UIStyle.Common.flex()}
                balance="100,0"
                separator=","
                tokenSymbol="G"
                loading
            />
        </UIButtonGroup>
    ))
    .add('UICard', () => (
        <UIButtonGroup direction={UIButtonGroup.Direction.Column} gutter={8}>
            <UICard
                labelIcon={icoActiveDefault}
                label="+333 Grams"
                caption="Today"
                size={UICard.Size.XS}
            />
            <UICard
                labelIcon={icoActiveDefault}
                actionIcon={iconDefault}
                label="Label XS"
                caption="Caption"
                onPress={() => alert('onPress was called')}
                size={UICard.Size.XS}
            />
            <UICard
                labelIcon={icoActiveDefault}
                actionIcon={iconDefault}
                onActionPress={() => alert('onActionPress was called')}
                label="Label XS"
                onPress={() => alert('onPress was called')}
                size={UICard.Size.XS}
            />
            <UICard
                labelIcon={icoActiveDefault}
                actionTitle="Action"
                onActionPress={() => alert('onActionPress was called')}
                label="Label XS"
                onPress={() => alert('onPress was called')}
                size={UICard.Size.XS}
            />
            <UICard
                labelIcon={icoActiveDefault}
                label="Label S"
                caption="Caption"
                onPress={() => alert('onPress was called')}
                size={UICard.Size.S}
            />
            <UICard
                labelIcon={icoActiveDefault}
                actionIcon={iconDefault}
                actionTitle="Action"
                label="Label M"
                caption="Caption"
                onPress={() => alert('onPress was called')}
                size={UICard.Size.M}
            />
            <UICard
                labelIcon={icoActiveDefault}
                actionIcon={iconDefault}
                onActionPress={() => alert('onActionPress was called')}
                actionTitle="Action"
                label="Looooooooooooo ooooooong Label M"
                caption="Caption"
                onPress={() => alert('onPress was called')}
                size={UICard.Size.M}
            />
            <UICard
                labelIcon={icoActiveDefault}
                label="Label L"
                caption="Caption"
                onPress={() => alert('onPress was called')}
                size={UICard.Size.L}
            />
            <UICard
                labelIcon={icoActiveDefault}
                label="Label L"
                caption="Caption"
                secondary="Secondary"
                data="Data"
                onPress={() => alert('onPress was called')}
                size={UICard.Size.L}
            />
            <UICard
                labelIcon={icoActiveDefault}
                label="Label L"
                caption="Caption"
                data="Data"
                badge={2}
                onPress={() => alert('onPress was called')}
                size={UICard.Size.L}
            />
            <UICard
                labelIcon={icoActiveDefault}
                label="Label L"
                caption="Caption"
                secondary="Secondary"
                onPress={() => alert('Action was called')}
                size={UICard.Size.L}
            />
            <UICard
                labelIcon={icoActiveDefault}
                label="Label L"
                caption="Caption"
                actionIcon={iconDefault}
                onActionPress={() => alert('onActionPress was called')}
                data="Data"
                onPress={() => alert('onPress was called')}
                size={UICard.Size.L}
            />
        </UIButtonGroup>
    ));
