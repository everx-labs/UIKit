import { PixelRatio } from 'react-native';
import html2canvas from 'html2canvas';

const PIXEL_RATIO_MULTIPLIER = 4;
const pixelRatio: number = PixelRatio.get() * PIXEL_RATIO_MULTIPLIER;

export const getScreenshot = async (screenId: string): Promise<string> => {
    const element: HTMLElement | null = document.getElementById(screenId);
    if (!element) {
        return '';
    }
    const canvas = await html2canvas(element, {
        backgroundColor: 'transparent',
        scale: pixelRatio,
    });
    const pngBase64: string = canvas.toDataURL('image/png');
    return pngBase64;
};
