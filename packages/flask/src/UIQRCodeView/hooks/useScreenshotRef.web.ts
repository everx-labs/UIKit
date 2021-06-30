import * as React from 'react';
import { PixelRatio } from 'react-native';
import html2canvas from 'html2canvas';

const PIXEL_RATIO_MULTIPLIER = 4;
const pixelRatio: number = PixelRatio.get() * PIXEL_RATIO_MULTIPLIER;

export const useScreenshotRef = (
    value: string,
    getPng?: (base64: string) => void, // returns base64
): React.MutableRefObject<null> => {
    const ref = React.useRef<null>(null);

    // save function
    const download = React.useCallback(
        (canv: HTMLCanvasElement): void => {
            // snapshot canvas as png
            const pngBase64: string = canv
                .toDataURL('image/png')
                .split(';base64,')[1];
            if (getPng && pngBase64) {
                getPng(pngBase64);
            }
        },
        [getPng],
    );

    React.useEffect((): void => {
        const element: HTMLElement | null = document.getElementById(
            `uri-qr-${value}`,
        );
        if (!element) {
            return;
        }
        html2canvas(element, {
            backgroundColor: 'transparent',
            scale: pixelRatio,
        }).then((canv: HTMLCanvasElement): void => {
            download(canv);
        });
    }, [download, value]);

    return ref;
};
