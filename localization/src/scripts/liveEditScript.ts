import { Platform } from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';

const helperId = 'localization-helper';

function createHandlers(event: MouseEvent) {
    if (event.target) {
        const target = event.target as HTMLDivElement;
        const message = document.getElementById(helperId);

        if (target.dataset?.lokalise && message) {
            const { color } = target.style;
            const content = target.dataset.key as string;
            if (content) {
                target.style.color = 'yellow';
                message.style.display = 'flex';
                message.innerHTML = content;

                const mouseClickHandler = (e: MouseEvent) => {
                    if (e.altKey) {
                        e.preventDefault();
                        Clipboard.setString(content);

                        // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
                        const { uiLocalized } = require('../service');
                        message.innerHTML = uiLocalized.CopiedToClipboard;
                    }
                };

                const mouseoutHandler = () => {
                    target.style.color = color;
                    message.style.display = 'none';
                    message.innerHTML = '';

                    target.removeEventListener('mouseout', mouseoutHandler);
                    target.removeEventListener('mouseout', mouseClickHandler);
                };

                target.addEventListener('mouseout', mouseoutHandler);
                target.addEventListener('click', mouseClickHandler);
            }
        }
    }
}
export function areLocalizationHintsEnabled() {
    if (Platform.OS !== 'web') {
        return false;
    }

    return !!document.getElementById(helperId);
}

export function enableLocalizationHints() {
    const message = document.createElement('div');
    message.setAttribute(
        'style',
        `
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 30px;
        background-color: rgba(0,0,0, 0.2);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100000;
        pointer-events: none;
        font-size: 18px;
        font-weight: bold;
    `,
    );
    message.setAttribute('id', helperId);

    document.body.appendChild(message);

    document.addEventListener('mouseover', createHandlers);
}

export function disableLocalizationHints() {
    document.removeEventListener('mouseover', createHandlers);

    const message = document.getElementById(helperId);

    if (message) {
        message.remove();
    }
}

export function initLiveEditScript(projectId: string, language: string): void {
    if (Platform.OS === 'web') {
        // @ts-ignore
        window.LOKALISE_CONFIG = {
            projectId,
            locale: language,
            disableAdvancedHtml: true,
        };

        const element = document.createElement('script');
        element.type = 'text/javascript';
        element.async = true;
        element.src = `https://app.lokalise.com/live-js/script.min.js?${new Date().getTime()}`;
        document.body.appendChild(element);
    }
}
