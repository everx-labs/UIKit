import { Clipboard, Platform } from 'react-native';

function createHandlers() {
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
    document.body.appendChild(message);

    document.addEventListener('mouseover', (event) => {
        if (event.target) {
            const target = event.target as HTMLDivElement;
            if (target.dataset.lokalise) {
                const { color } = target.style;
                const content = target.dataset.key as string;

                target.style.color = 'yellow';
                message.style.display = 'flex';
                message.innerHTML = content;

                const mouseoutHandler = () => {
                    target.style.color = color;
                    message.style.display = 'none';
                    message.innerHTML = '';

                    target.removeEventListener('mouseout', mouseoutHandler);
                };

                const mouseClickHandler = (e: MouseEvent) => {
                    if (e.altKey) {
                        e.preventDefault();
                        Clipboard.setString(content);

                        // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
                        const { uiLocalized } = require('../service');
                        message.innerHTML = uiLocalized.CopiedToClipboard;
                    }
                };

                target.addEventListener('mouseout', mouseoutHandler);
                target.addEventListener('click', mouseClickHandler);
            }
        }
    });
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
        // document.body.appendChild(element);

        createHandlers();
    }
}
