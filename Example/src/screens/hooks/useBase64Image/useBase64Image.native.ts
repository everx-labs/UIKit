import * as React from 'react';
import RNFetchBlob from 'rn-fetch-blob';

export const useBase64Image = (imageUrl: string): string | null => {
    const [imageEncoded, setImageEncoded] = React.useState<string | null>(null);

    React.useEffect(() => {
        RNFetchBlob.fetch('GET', imageUrl).then((result) => {
            const contentType: string | undefined =
                result?.respInfo?.headers['Content-Type'] ||
                result?.respInfo?.headers['content-type'];

            const base64: string | undefined = result?.base64();

            if (contentType && base64) {
                setImageEncoded(`data:${contentType};base64,${base64}`);
            }
        });
    }, [imageUrl]);

    return imageEncoded;
};
