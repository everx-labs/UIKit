import * as React from 'react';

export const useBase64Image = (imageUri: any): string | null => {
    const [imageEncoded, setImageEncoded] = React.useState<string | null>(null);
    const readerRef = React.useRef(new FileReader());
    React.useEffect(() => {
        readerRef.current.onloadend = () => {
            if (
                readerRef.current.result &&
                typeof readerRef.current.result === 'string'
            )
                setImageEncoded(readerRef.current.result);
        };
    }, []);

    React.useEffect(() => {
        fetch(imageUri)
            .then((response) => response.blob())
            .then((blob) => {
                readerRef.current.readAsDataURL(blob);
            });
    }, [imageUri]);

    return imageEncoded;
};
