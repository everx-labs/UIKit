import * as React from 'react';

export const useBase64Image = (imageUrl: string): string | null => {
    const [imageEncoded, setImageEncoded] = React.useState<string | null>(null);
    const readerRef = React.useRef(new FileReader());
    React.useEffect(() => {
        readerRef.current.onloadend = () => {
            if (readerRef.current.result && typeof readerRef.current.result === 'string')
                setImageEncoded(readerRef.current.result);
        };
    }, []);

    React.useEffect(() => {
        fetch(imageUrl)
            .then(response => {
                return response.blob();
            })
            .then(blob => {
                readerRef.current.readAsDataURL(blob);
            });
    }, [imageUrl]);

    return imageEncoded;
};
