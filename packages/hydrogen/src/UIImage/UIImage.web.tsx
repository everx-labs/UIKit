import * as React from 'react';
import { nanoid } from 'nanoid';

import {
    ColorValue,
    Image as RNImage,
    ImageStyle,
    LayoutChangeEvent,
    LayoutRectangle,
    StyleProp,
    StyleSheet,
    View,
} from 'react-native';
import { useTheme } from '../Colors';
import type { UIImageProps } from './types';

const useImageDimensions = (style: StyleProp<ImageStyle>, source: any) => {
    return React.useMemo(() => {
        let width: number | string | undefined = undefined;
        let height: number | string | undefined = undefined;
        const flatStyle = StyleSheet.flatten(style);
        if (flatStyle) {
            if (flatStyle.width) {
                width = flatStyle.width;
            }
            if (flatStyle.height) {
                height = flatStyle.height;
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

const TintUIImage = ({ tintColor, style, onLoadEnd, onError, ...rest }: UIImageProps) => {
    const theme = useTheme();
    const tintColorValue: ColorValue | null = tintColor != null ? theme[tintColor] : null;

    const idRef = React.useRef(nanoid());
    const [hasError, setHasError] = React.useState<boolean>(false);

    const source = rest.source as any;

    const { uri } = source;
    const { width, height } = useImageDimensions(style, source);

    const [dimensions, setDimensions] = React.useState<LayoutRectangle | null>(null);

    const onLayout = (event: LayoutChangeEvent) => {
        if (rest.onLayout) {
            rest.onLayout(event);
        }
        setDimensions(event.nativeEvent.layout);
    };

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
            if (!ctx || !dimensions) {
                return;
            }
            // draw image
            ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);
            // set composite mode
            ctx.globalCompositeOperation = 'source-in';
            // draw color
            ctx.fillStyle = tintColorValue as string;
            ctx.fillRect(0, 0, dimensions.width, dimensions.height);

            if (onLoadEnd) {
                onLoadEnd();
            }
        };
        img.src = uri;
    }, [uri, dimensions]);

    if (hasError || !tintColorValue || !width || !height || !uri) {
        if (__DEV__) {
            console.error(
                `UIImage.web.tsx: there was tintColor provided for image, ` +
                    `but no width and height specified, please ensure that they're passed ` +
                    `in the styles or in the source correctly.` +
                    `${rest.testID ? `TestID: ${rest.testID}` : ''}`,
            );
        }
        return React.createElement(RNImage, rest);
    }

    return (
        <View
            testID={rest.testID}
            onLayout={onLayout}
            style={[
                style,
                {
                    width,
                    height,
                },
            ]}
        >
            <canvas id={`${idRef.current}`} width={dimensions?.width} height={dimensions?.height} />
        </View>
    );
};

const UIImageImpl = (props: UIImageProps) => {
    const { tintColor, ...rest } = props;
    const theme = useTheme();

    /**
     * Delete TintUIImage and "if" block below when the issue is fixed:
     * https://github.com/necolas/react-native-web/issues/1914
     */
    if (tintColor) {
        return <TintUIImage {...props} />;
    }

    return (
        <RNImage
            {...rest}
            style={[rest.style, tintColor != null ? { tintColor: theme[tintColor] } : null]}
        />
    );
};

export const UIImage = React.memo(UIImageImpl);
