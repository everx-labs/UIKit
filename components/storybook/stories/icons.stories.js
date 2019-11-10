import React from 'react';
import { Image, View, Text } from 'react-native';

import CenterView from '../CenterView';

import { storiesOf } from '../helpers/storiesOf';
import { getUri } from '../helpers/getUri';

import {
    UIStyle,
    UIButtonGroup,
} from '../../../UIKit';

import Constants from '../helpers/constants';

const iconFigma = getUri(require('../../../assets/brand/develop/figma.png'), 24, 24);
const iconNodejs = getUri(require('../../../assets/brand/develop/nodejs.png'), 24, 24);
const iconReact = getUri(require('../../../assets/brand/develop/react.png'), 24, 24);
const iconRust = getUri(require('../../../assets/brand/develop/rust.png'), 24, 24);
const iconWA = getUri(require('../../../assets/brand/develop/webassembly.png'), 24, 24);

const devIcons = [
    { name: 'figma.png\n', source: iconFigma },
    { name: 'nodejs.png\n', source: iconNodejs },
    { name: 'react.png\n', source: iconReact },
    { name: 'rust.png\n', source: iconRust },
    { name: 'webassembly.png', source: iconWA },
];

const iconApplepay = getUri(require('../../../assets/brand/payment/applepay.png'), 48, 24);
const iconGooglepay = getUri(require('../../../assets/brand/payment/googlepay.png'), 48, 24);
const iconMaestro = getUri(require('../../../assets/brand/payment/maestro.png'), 24, 24);
const iconMasterSec = getUri(require('../../../assets/brand/payment/mastercard-securecode.png'), 64, 32);
const iconMaster = getUri(require('../../../assets/brand/payment/mastercard.png'), 24, 24);
const iconVerifiedVisa = getUri(require('../../../assets/brand/payment/verified-byvisa.png'), 64, 32);
const iconVisa = getUri(require('../../../assets/brand/payment/visa.png'), 24, 24);

const paymentIcons = [
    { name: 'applepay.png\n', source: iconApplepay },
    { name: 'googlepay.png\n', source: iconGooglepay },
    { name: 'maestro.png\n', source: iconMaestro },
    { name: 'mastercard-securecode.png\n', source: iconMasterSec },
    { name: 'mastercard.png\n', source: iconMaster },
    { name: 'verified-byvisa.png\n', source: iconVerifiedVisa },
    { name: 'visa.png', source: iconVisa },
];

const iconAndroid = getUri(require('../../../assets/brand/platform/android.png'), 24, 24);
const iconApple = getUri(require('../../../assets/brand/platform/apple.png'), 24, 24);
const iconAppstore = getUri(require('../../../assets/brand/platform/appstore.png'), 24, 24);
const iconChrome = getUri(require('../../../assets/brand/platform/chrome.png'), 24, 24);
const iconGoogle = getUri(require('../../../assets/brand/platform/google.png'), 24, 24);
const iconGoogleplay = getUri(require('../../../assets/brand/platform/googleplay.png'), 24, 24);
const iconOpera = getUri(require('../../../assets/brand/platform/opera.png'), 24, 24);
const iconSafari = getUri(require('../../../assets/brand/platform/safari.png'), 24, 24);

const platformIcons = [
    { name: 'android.png\n', source: iconAndroid },
    { name: 'apple.png\n', source: iconApple },
    { name: 'appstore.png\n', source: iconAppstore },
    { name: 'chrome.png\n', source: iconChrome },
    { name: 'google.png\n', source: iconGoogle },
    { name: 'googleplay.png\n', source: iconGoogleplay },
    { name: 'opera.png\n', source: iconOpera },
    { name: 'safari.png', source: iconSafari },
];

const iconFacebook = getUri(require('../../../assets/brand/social/facebook.png'), 24, 24);
const iconGithub = getUri(require('../../../assets/brand/social/github.png'), 24, 24);
const iconLinkedin = getUri(require('../../../assets/brand/social/linkedIn.png'), 24, 24);
const iconReddit = getUri(require('../../../assets/brand/social/reddit.png'), 24, 24);
const iconTelegram = getUri(require('../../../assets/brand/social/telegram.png'), 24, 24);
const iconTwitter = getUri(require('../../../assets/brand/social/twitter.png'), 24, 24);
const iconYoutube = getUri(require('../../../assets/brand/social/youtube.png'), 24, 24);

const socialIcons = [
    { name: 'facebook.png\n', source: iconFacebook },
    { name: 'github.png\n', source: iconGithub },
    { name: 'linkedIn.png\n', source: iconLinkedin },
    { name: 'reddit.png\n', source: iconReddit },
    { name: 'telegram.png\n', source: iconTelegram },
    { name: 'twitter.png\n', source: iconTwitter },
    { name: 'youtube.png', source: iconYoutube },
];

const iconTondev = getUri(require('../../../assets/brand/tonlines/tondev.png'), 24, 24);
const iconTonlabs = getUri(require('../../../assets/brand/tonlines/tonlabs.png'), 24, 24);
const iconTonlabsSquare = getUri(require('../../../assets/brand/tonlines/tonlabs-square.png'), 24, 24);
const iconTonlabsOld = getUri(require('../../../assets/brand/tonlines/tonlabs-old.png'), 24, 24);
const iconTonwallet = getUri(require('../../../assets/brand/tonlines/tonwallet.png'), 24, 24);
const iconTonwalletOld = getUri(require('../../../assets/brand/tonlines/tonwallet-old.png'), 24, 24);

const tonlinesIcons = [
    { name: 'tondev.png\n', source: iconTondev },
    { name: 'tonlabs.png\n', source: iconTonlabs },
    { name: 'tonlabs-square.png\n', source: iconTonlabsSquare },
    { name: 'tonlabs-old.png\n', source: iconTonlabsOld },
    { name: 'tonwallet.png\n', source: iconTonwallet },
    { name: 'tonwallet-old.png', source: iconTonwalletOld },
];

function renderTitle(title, folder) {
    return (
        <Text style={UIStyle.Text.primaryCaptionMedium()}>
            {`${title}: import icon from 'UIKit/assets/brand/${folder}/...'`}
        </Text>
    );
}

function renderSection(icons) {
    return (
        <React.Fragment>
            <Text style={[
                UIStyle.Text.primaryCaptionRegular(),
                UIStyle.margin.bottomDefault(),
                UIStyle.margin.topDefault(),
            ]}
            >
                {icons.map(item => item.name)}
            </Text>
            <UIButtonGroup direction={UIButtonGroup.Direction.Row} >
                {icons.map(item => <Image key={item.name} source={item.source} />)}
            </UIButtonGroup>
        </React.Fragment>
    );
}

storiesOf(Constants.CategoryIcons, module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('Brand', () => (
        <UIButtonGroup direction={UIButtonGroup.Direction.Column} gutter={32}>
            <View>
                {renderTitle('Develop', 'develop')}
                {renderSection(devIcons)}
            </View>
            <View>
                {renderTitle('Payment', 'payment')}
                {renderSection(paymentIcons)}
            </View>
            <View>
                {renderTitle('Platform', 'platform')}
                {renderSection(platformIcons)}
            </View>
            <View>
                {renderTitle('Social', 'social')}
                {renderSection(socialIcons)}
            </View>
            <View>
                {renderTitle('Tonlines', 'tonlines')}
                {renderSection(tonlinesIcons)}
            </View>
        </UIButtonGroup>
    ));
