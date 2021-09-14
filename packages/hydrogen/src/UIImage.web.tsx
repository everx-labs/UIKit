import * as React from 'react';

import { ColorValue, Image as RNImage, ImageProps, StyleSheet, View } from 'react-native';
import { ColorVariants, useTheme } from './Colors';

export type UIImageProps = ImageProps & {
    /**
     * tintColor in some cases don't work on Safary with RNImage.
     * Here is the issue: https://github.com/necolas/react-native-web/issues/1914
     * Hence passing this prop we force to use canvas
     */
    tintColor?: ColorVariants | null;
};

const DEFAULT_SCALE = 2;

const useScale = (source: any): number => {
    return React.useMemo(() => {
        if (
            !source ||
            !source.data ||
            !source.uri ||
            !!source.data ||
            !source.data.uri ||
            !source.data['uri@2x'] ||
            !source.data['uri@3x']
        ) {
            return DEFAULT_SCALE;
        }
        if (source.uri === source.data.uri) {
            return 1;
        } else if (source.uri === source.data['uri@2x']) {
            return 2;
        } else if (source.uri === source.data['uri@3x']) {
            return 3;
        }
        return DEFAULT_SCALE;
    }, [source.uri]);
};

const TintUIImage = ({ tintColor, ...rest }: UIImageProps) => {
    const theme = useTheme();
    const tintColorValue: ColorValue | null = tintColor != null ? theme[tintColor] : null;

    const idRef = React.useRef(Math.random());
    const [hasError, setHasError] = React.useState<boolean>(false);

    const source = rest.source as any;

    /**
     * Scaling is necessary in order to keep the image quality at the same level
     */
    const scale = useScale(source);

    const { width, height, uri } = source;

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
        };
        img.src = uri;
    }, [uri]);

    if (hasError || !tintColorValue || !width || !height || !uri) {
        return React.createElement(RNImage, rest);
    }

    return (
        <View
            style={{
                width,
                height,
            }}
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

export function UIImage(props: UIImageProps) {
    const { tintColor, ...rest } = props;

    if (tintColor) {
        return <TintUIImage {...props} />;
    }

    return React.createElement(RNImage, rest);
}

const styles = StyleSheet.create({
    tintImageContent: {
        position: 'absolute',
        top: '-50%',
        left: '-50%',
    },
});
