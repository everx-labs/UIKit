import React from 'react';
import { UserAgent } from '@quentin-sommer/react-useragent';

import { UIComponent } from '@uikit/components';

class UIUserAgent extends UIComponent {
    static Browsers = {
        Opera: 'Opera',
        Chrome: 'Chrome',
        Safari: 'Safari',
    };

    static OS = {
        IOS: 'iOS',
        Android: 'Android',
    };

    constructor(props) {
        super(props);

        this.state = {
            browser: '',
            platform: '',
        };
    }

    // Setters
    setBrowser(browser) {
        this.setStateSafely({ browser });
    }

    setPlatform(platform) {
        this.setStateSafely({ platform });
    }

    // Getters
    getBrowser() {
        return this.state.browser;
    }

    getPlatform() {
        return this.state.platform;
    }

    getBrowserIcon({ icoSafari, icoChrome, icoOpera }) {
        if (this.browser.includes(UIUserAgent.Browsers.Safari)) {
            return icoSafari;
        }
        switch (this.browser) {
        case UIUserAgent.Browsers.Chrome:
            return icoChrome;
        case UIUserAgent.Browsers.Opera:
            return icoOpera;
        default:
            return null;
        }
    }

    // Virtual
    renderContent(params) {
        return null;
    }

    render() {
        return (
            <UserAgent returnFullParser>
                {(parser) => {
                    const browser = parser.getBrowser().name;
                    const platform = parser.getOS().name.split(' ')[0];
                    this.browser = browser;
                    this.platform = platform;
                    return this.renderContent({
                        browser,
                        platform,
                    });
                }}
            </UserAgent>
        );
    }
}

export default UIUserAgent;
