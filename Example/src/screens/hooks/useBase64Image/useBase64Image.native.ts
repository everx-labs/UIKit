import * as React from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import { Platform } from 'react-native';

const useImageSource = (name: string): string | undefined => {
    return React.useMemo(() => {
        return Platform.select<string>({
            ios: `${RNFetchBlob.fs.dirs.MainBundleDir}/${name}`,
            android: RNFetchBlob.fs.asset(name),
        });
    }, [name]);
};

const useImageFormat = (name: string): string | undefined => {
    return React.useMemo(() => {
        const splitedName = name.split('.');
        return splitedName[splitedName.length - 1];
    }, [name]);
};

export const useBase64Image = (_imageUri: any, name: string): string | null => {
    const imageSource = useImageSource(name);
    const imageFormat = useImageFormat(name);
    const [imageEncoded, setImageEncoded] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (imageSource && imageFormat) {
            RNFetchBlob.fs.readFile(imageSource, 'base64').then((result) => {
                if (result && typeof result === 'string') {
                    setImageEncoded(
                        `data:image/${imageFormat};base64,${result}`,
                    );
                }
            });
        }
    }, [imageSource, imageFormat]);

    return imageEncoded;
};
