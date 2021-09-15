/**
 * Delete this file when the issue is fixed:
 * https://github.com/necolas/react-native-web/issues/1914
 */
import * as React from 'react';
import { nanoid } from 'nanoid';

import { ColorValue, Image as RNImage, ImageProps, StyleSheet, View } from 'react-native';
import { ColorVariants, useTheme } from './Colors';

const useImageDimensions = (style: any, source: any) => {
    return React.useMemo(() => {
        let width = 0;
        let height = 0;
        if (style) {
            if (style.width) {
                width = style.width;
            }
            if (style.height) {
                height = style.height;
            }
        }
        if (!width && source && source.width) {
            width = source.width;
        }
        if (!height && source && source.height) {
            height = source.height;
        }
        return {
            width,
            height,
        };
    }, [style, source && source.uri]);
};

export type UIImageProps = ImageProps & {
    /**
     * tintColor in some cases don't work on Safary with RNImage.
     * Here is the issue: https://github.com/necolas/react-native-web/issues/1914
     * Hence passing this prop we force to use canvas
     */
    tintColor?: ColorVariants | null;
};

/**
 * Scaling is necessary in order to keep the image quality at the same level
 */
const scale = 2;

const TintUIImage = ({ tintColor, style, onLoadEnd, onError, ...rest }: UIImageProps) => {
    const theme = useTheme();
    const tintColorValue: ColorValue | null = tintColor != null ? theme[tintColor] : null;

    const idRef = React.useRef(nanoid());
    const [hasError, setHasError] = React.useState<boolean>(false);

    const source = rest.source as any;

    const { uri } = source;
    const { width, height } = useImageDimensions(style, source);

    React.useEffect(() => {
        if (!tintColorValue || !width || !height || !uri) {
            setHasError(true);
            return;
        }
        var img = new Image();
        var currentCanvas = document.getElementById(`${idRef.current}`) as any;
        if (!currentCanvas || !currentCanvas.getContext) {
            setHasError(true);
            return;
        }
        var ctx: CanvasRenderingContext2D | undefined = currentCanvas.getContext('2d');
        if (!ctx) {
            setHasError(true);
            return;
        }
        img.onload = () => {
            if (!ctx) {
                return;
            }
            ctx.scale(scale, scale);
            // draw image
            ctx.drawImage(img, 0, 0, width, height);
            // set composite mode
            ctx.globalCompositeOperation = 'source-in';
            // draw color
            ctx.fillStyle = tintColorValue as string;
            ctx.fillRect(0, 0, width, height);

            if (onLoadEnd) {
                onLoadEnd();
            }
        };
        img.src = uri;
    }, [uri]);

    if (hasError || !tintColorValue || !width || !height || !uri) {
        if (__DEV__) {
            console.error(
                `UIImage.web.tsx: canvas rendering error, tintcolor will not be applied.${
                    rest.testID ? `TestID: ${rest.testID}` : ''
                }`,
            );
        }
        return React.createElement(RNImage, rest);
    }

    return (
        <View
            testID={rest.testID}
            onLayout={rest.onLayout}
            style={[
                style,
                {
                    width,
                    height,
                },
            ]}
        >
            <View
                style={[
                    styles.tintImageContent,
                    {
                        transform: [
                            {
                                scale: 1 / scale,
                            },
                        ],
                    },
                ]}
            >
                <canvas id={`${idRef.current}`} width={width * scale} height={height * scale} />
            </View>
        </View>
    );
};

const UIImageImpl = (props: UIImageProps) => {
    const { tintColor, ...rest } = props;

    if (tintColor) {
        return <TintUIImage {...props} />;
    }

    return React.createElement(RNImage, rest);
};

/**
 * Delete this file when the issue is fixed:
 * https://github.com/necolas/react-native-web/issues/1914
 */
export const UIImage = React.memo(UIImageImpl);

const styles = StyleSheet.create({
    tintImageContent: {
        position: 'absolute',
        top: '-50%',
        left: '-50%',
    },
});
