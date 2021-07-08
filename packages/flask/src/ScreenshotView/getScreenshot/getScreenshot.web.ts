import { PixelRatio, View } from 'react-native';
import html2canvas from 'html2canvas';

const PIXEL_RATIO_MULTIPLIER = 4;
const pixelRatio: number = PixelRatio.get() * PIXEL_RATIO_MULTIPLIER;

export const getScreenshot = async (
    ref: React.MutableRefObject<View | null>,
): Promise<string | null> => {
    if (!ref.current) {
        return null;
    }
    // @ts-ignore
    const canvas = await html2canvas(ref.current, {
        backgroundColor: 'transparent',
        scale: pixelRatio,
    });
    const pngBase64: string = canvas.toDataURL('image/png');
    return pngBase64;
};
