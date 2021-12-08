import * as React from 'react';
import { nanoid } from 'nanoid';

import {
    ColorValue,
    Image as RNImage,
    ImageStyle,
    ImageURISource,
    LayoutChangeEvent,
    LayoutRectangle,
    StyleProp,
    StyleSheet,
    View,
} from 'react-native';
import { useTheme } from '@tonlabs/uikit.themes';
import type { UIImageProps } from './types';

export function prefetch(content: ImageURISource[] | ImageURISource): void {
    if (!content || (Array.isArray(content) && content.length === 0)) {
        /**
         * Nothing to prefetch
         */
        return;
    }

    if (Array.isArray(content)) {
        content.forEach((contentItem: ImageURISource): void => {
            if (contentItem.uri) {
                RNImage.prefetch(contentItem.uri);
            }
        });
    } else if (content.uri) {
        RNImage.prefetch(content.uri);
    }
}

const useImageDimensions = (style: StyleProp<ImageStyle>, source: any) => {
    return React.useMemo(() => {
        let width: number | string | undefined;
        let height: number | string | undefined;
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
    }, [source, style]);
};

const TintUIImage = React.forwardRef<View, UIImageProps>(function TintUIImageForwarded(
    { tintColor, style, onLoadEnd, ...rest }: UIImageProps,
    ref,
) {
    const theme = useTheme();
    const tintColorValue: ColorValue | null = tintColor != null ? theme[tintColor] : null;

    const isMounted = React.useRef<boolean>(false);
    const idRef = React.useRef(nanoid());
    const [hasError, setHasError] = React.useState<boolean>(false);
    const [dimensions, setDimensions] = React.useState<LayoutRectangle | null>(null);

    React.useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);

    const source = rest.source as any;

    const { uri } = source;
    const { width, height } = useImageDimensions(style, source);

    const onLayout = (event: LayoutChangeEvent) => {
        if (rest.onLayout) {
            rest.onLayout(event);
        }
        if (isMounted.current) {
            setDimensions(event.nativeEvent.layout);
        }
    };

    React.useEffect(() => {
        if (!tintColorValue || !width || !height || !uri) {
            if (isMounted.current) {
                setHasError(true);
            }
            return;
        }
        const img = new Image();
        const currentCanvas = document.getElementById(`${idRef.current}`) as HTMLCanvasElement;
        if (!currentCanvas || !currentCanvas.getContext) {
            if (isMounted.current) {
                setHasError(true);
            }
            return;
        }

        const ctx: CanvasRenderingContext2D | null = currentCanvas.getContext('2d');
        if (!ctx) {
            if (isMounted.current) {
                setHasError(true);
            }
            return;
        }

        img.onload = () => {
            if (!ctx || !dimensions) {
                return;
            }

            currentCanvas.style.width = `${dimensions.width}px`;
            currentCanvas.style.height = `${dimensions.height}px`;

            // https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio#correcting_resolution_in_a_canvas
            const scale = window.devicePixelRatio;

            currentCanvas.width = Math.floor(dimensions.width * scale);
            currentCanvas.height = Math.floor(dimensions.height * scale);

            ctx.scale(scale, scale);

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
    }, [uri, dimensions, tintColorValue, width, height, onLoadEnd]);

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
            ref={ref}
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
});

const UIImageImpl = React.forwardRef<RNImage, UIImageProps>(function UIImageForwarded(props, ref) {
    const { tintColor, ...rest } = props;
    const theme = useTheme();

    /**
     * Delete TintUIImage and "if" block below when the issue is fixed:
     * https://github.com/necolas/react-native-web/issues/1914
     */
    if (tintColor) {
        return <TintUIImage ref={ref} {...props} />;
    }

    return (
        <RNImage
            ref={ref}
            {...rest}
            style={[rest.style, tintColor != null ? { tintColor: theme[tintColor] } : null]}
        />
    );
});

export const UIImage = React.memo(UIImageImpl);
